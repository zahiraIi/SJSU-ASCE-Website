// This script fetches company names from the Google Sheet and updates their logos

const fs = require('fs');
const path = require('path');
const https = require('https');
const { google } = require('googleapis');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

// Script configuration - adjust these settings as needed
const CONFIG = {
  // Set to true to only log what would be done without making changes
  TEST_MODE: false,
  
  // Set to true to skip downloading logos (uses existing ones only)
  SKIP_LOGO_DOWNLOAD: false,
  
  // Set to true to force update even if the company already exists in sponsors list
  FORCE_UPDATE: false,
  
  // Set to true for more verbose output
  VERBOSE: true
};

// Process any command line arguments
process.argv.forEach(arg => {
  if (arg === '--test' || arg === '-t') {
    CONFIG.TEST_MODE = true;
    console.log('Running in TEST MODE - no changes will be made');
  } else if (arg === '--skip-logos') {
    CONFIG.SKIP_LOGO_DOWNLOAD = true;
    console.log('Skipping logo downloads');
  } else if (arg === '--force') {
    CONFIG.FORCE_UPDATE = true;
    console.log('Force update enabled');
  } else if (arg === '--quiet' || arg === '-q') {
    CONFIG.VERBOSE = false;
  }
});

// Google Sheet ID from the URL
const SPREADSHEET_ID = '1KegsEjAEdRo5M_iRgZrVptxIYmmJ7bADj2vJdAB-GGo';
const SHEET_RANGE = 'A2:C100'; // Range to fetch (column A-C, rows 2-100)

// Directory where the logos will be saved
const logosDir = path.join(__dirname, '../public/images/sponsors');
const sponsorsFilePath = path.join(__dirname, '../app/sponsors/page.tsx');

// Default fallback logo when none can be found
const placeholderPath = path.join(logosDir, 'company-placeholder.svg');

// Logging helper
function log(message, important = false) {
  if (CONFIG.VERBOSE || important) {
    console.log(message);
  }
}

// Create the directory if it doesn't exist
async function createDirectories() {
  try {
    if (!fs.existsSync(logosDir)) {
      log(`Creating directory: ${logosDir}`, true);
      
      if (!CONFIG.TEST_MODE) {
        fs.mkdirSync(logosDir, { recursive: true });
      }
    }
  } catch (err) {
    console.error('Error creating directory:', err);
  }
}

// Convert company name to a safe filename
function getFilenameFromCompany(companyName) {
  return companyName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/-+/g, '-')         // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '');      // Remove leading/trailing dashes
}

// Fetch company data from the Google Sheet
async function fetchCompaniesFromSheet() {
  try {
    log('Fetching company data from Google Sheet...', true);
    
    // For simplicity, we'll use direct HTTP request to fetch published sheet
    // Note: This only works for publicly viewable sheets
    const url = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;
    
    const response = await axios.get(url);
    const csvData = response.data;
    
    // Parse CSV data
    const lines = csvData.split('\n');
    const companies = [];
    let currentSection = 'Construction Management';
    
    // Define section headers to look for
    const sectionHeaders = [
      'Construction Management',
      'Structural',
      'Environmental',
      'Transportation',
      'Water Resources',
      'Geotechnical',
      'Land Development',
      'Heavy Civil',
      'Civil Engineering',
      'Mining',
      'Utilities'
    ];
    
    for (const line of lines) {
      // Skip empty lines
      if (!line.trim()) continue;
      
      // Clean up quoted values and split by comma
      let values = [];
      let inQuotes = false;
      let currentValue = '';
      
      // More robust CSV parsing
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Trim all values
      values = values.map(v => v.trim());
      
      // Check if this is a section header
      const matchedSection = sectionHeaders.find(header => 
        line.includes(header) && values[0].includes(header)
      );
      
      if (matchedSection) {
        currentSection = matchedSection;
        log(`Found section: ${currentSection}`);
        continue;
      }
      
      // If first column is a company (not empty, not "Company" header, and not a section)
      if (values[0] && 
          values[0] !== 'Company' && 
          values[0] !== 'Company ' && 
          !sectionHeaders.some(header => values[0].includes(header))) {
        
        // Check if this row has company data
        // First column should be the company name
        const companyName = values[0].trim();
        
        // Third column might be the website
        let website = '';
        if (values.length > 2) {
          website = values[2] ? values[2].trim() : '';
        }
        
        companies.push({
          name: companyName,
          section: currentSection,
          website: website
        });
        
        if (CONFIG.VERBOSE) {
          log(`Added company: ${companyName} (${currentSection})`);
        }
      }
    }
    
    log(`Found ${companies.length} companies in the sheet.`, true);
    return companies;
  } catch (error) {
    console.error('Error fetching companies from Google Sheet:', error.message);
    return [];
  }
}

// Search for company logo using various methods
async function searchCompanyLogo(company) {
  try {
    const companyName = company.name;
    const safeName = getFilenameFromCompany(companyName);
    const logoFile = path.join(logosDir, `${safeName}.png`);
    
    // If logo already exists, skip
    if (fs.existsSync(logoFile)) {
      log(`Logo for ${companyName} already exists at ${logoFile}. Skipping...`);
      return { success: true, filename: `${safeName}.png` };
    }
    
    // Check if SVG version exists
    if (fs.existsSync(path.join(logosDir, `${safeName}.svg`))) {
      log(`Logo for ${companyName} already exists as SVG. Skipping...`);
      return { success: true, filename: `${safeName}.svg` };
    }
    
    // Skip logo download if configured
    if (CONFIG.SKIP_LOGO_DOWNLOAD) {
      log(`Skipping logo download for ${companyName} due to configuration.`);
      return { success: false, filename: null };
    }
    
    log(`Searching for logo: ${companyName}`);
    
    // Method 1: Try to extract domain from website if available
    let domain = '';
    if (company.website) {
      try {
        const websiteUrl = company.website.startsWith('http') ? 
                          company.website : 
                          `https://${company.website}`;
        
        const url = new URL(websiteUrl);
        domain = url.hostname.replace('www.', '');
        
        // Try Clearbit Logo API for the domain
        if (domain) {
          const clearbitUrl = `https://logo.clearbit.com/${domain}?size=128`;
          
          try {
            // Check if logo exists
            const response = await axios.head(clearbitUrl);
            
            if (response.status === 200) {
              if (!CONFIG.TEST_MODE) {
                await downloadImage(clearbitUrl, logoFile);
              }
              log(`Downloaded logo for ${companyName} from Clearbit`, true);
              return { success: true, filename: `${safeName}.png` };
            }
          } catch (err) {
            log(`No logo found at Clearbit for ${domain}`);
          }
        }
        
        // Method 2: Try to fetch common logo paths from the website
        const logoPaths = [
          '/logo.png',
          '/images/logo.png',
          '/img/logo.png',
          '/assets/logo.png',
          '/assets/images/logo.png',
          '/wp-content/themes/theme/images/logo.png',
          '/wp-content/uploads/logo.png',
          '/wp-content/uploads/site-logo.png'
        ];
        
        for (const logoPath of logoPaths) {
          try {
            const logoUrl = new URL(logoPath, websiteUrl).toString();
            const response = await axios.head(logoUrl);
            
            if (response.status === 200) {
              if (!CONFIG.TEST_MODE) {
                await downloadImage(logoUrl, logoFile);
              }
              log(`Downloaded logo for ${companyName} from ${logoUrl}`, true);
              return { success: true, filename: `${safeName}.png` };
            }
          } catch (err) {
            // Continue to next path
          }
        }
      } catch (err) {
        log(`Invalid website URL for ${companyName}: ${company.website}`);
      }
    }
    
    // Method 3: Try logo finder service (for demo purposes)
    // In a production environment, you might use paid APIs like:
    // - Google Custom Search API
    // - Bing Image Search API
    // - Brand API
    
    // For this script, we'll just create a custom placeholder
    log(`No logo found for ${companyName}, creating placeholder`, true);
    if (!CONFIG.TEST_MODE) {
      await createCustomPlaceholder(safeName, companyName);
    }
    return { success: true, filename: `${safeName}.svg` };
  } catch (error) {
    console.error(`Error finding logo for ${company.name}:`, error.message);
    return { success: false, filename: null };
  }
}

// Download image from URL
async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    }).then(response => {
      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);
      
      writer.on('finish', resolve);
      writer.on('error', reject);
    }).catch(reject);
  });
}

// Create a placeholder SVG with company name
async function createCustomPlaceholder(safeName, companyName) {
  try {
    const outputPath = path.join(logosDir, `${safeName}.svg`);
    
    // Read the base placeholder SVG template
    let svgTemplate = fs.readFileSync(placeholderPath, 'utf8');
    
    // Replace the text with company name
    const displayName = companyName.length > 20 ? 
                        companyName.substring(0, 18) + '...' : 
                        companyName;
                        
    svgTemplate = svgTemplate.replace('>COMPANY<', `>${displayName}<`);
    
    // Write the custom SVG to a file
    fs.writeFileSync(outputPath, svgTemplate);
    log(`Created custom placeholder for ${companyName}`);
    return true;
  } catch (error) {
    console.error(`Error creating placeholder for ${companyName}:`, error.message);
    return false;
  }
}

// Update the sponsors data in the React component
async function updateSponsorsData(companies) {
  try {
    log('Updating sponsors data in the React component...', true);
    
    if (CONFIG.TEST_MODE) {
      log('TEST MODE: Would update the sponsors data with these companies:');
      companies.forEach((company, index) => {
        log(`  ${index + 1}. ${company.name} (${company.section})`);
      });
      return true;
    }
    
    // Read the existing sponsors page
    let pageContent = fs.readFileSync(sponsorsFilePath, 'utf8');
    
    // Extract the SPONSORS array
    const startMarker = '// Updated sponsor data with real companies';
    const endMarker = '];';
    
    const startIndex = pageContent.indexOf(startMarker);
    let endIndex = pageContent.indexOf(endMarker, startIndex);
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Could not find SPONSORS array in the page.tsx file');
    }
    
    endIndex += endMarker.length;
    
    // Generate the new sponsors array
    let newSponsorsCode = `// Updated sponsor data with real companies\nconst SPONSORS = [\n`;
    
    let id = 1;
    let currentSection = '';
    
    for (const company of companies) {
      if (company.section !== currentSection) {
        newSponsorsCode += `  // ${company.section} Companies\n`;
        currentSection = company.section;
      }
      
      const safeName = getFilenameFromCompany(company.name);
      let logoPath = '';
      
      // Check which file extension exists
      if (fs.existsSync(path.join(logosDir, `${safeName}.svg`))) {
        logoPath = `/images/sponsors/${safeName}.svg`;
      } else if (fs.existsSync(path.join(logosDir, `${safeName}.png`))) {
        logoPath = `/images/sponsors/${safeName}.png`;
      } else {
        // Default to placeholder
        logoPath = `/images/sponsors/company-placeholder.svg`;
      }
      
      newSponsorsCode += `  { id: ${id}, name: '${company.name.replace(/'/g, "\\'")}', logo: '${logoPath}', url: '${(company.website || 'https://example.com').replace(/'/g, "\\'")}' },\n`;
      id++;
    }
    
    newSponsorsCode += `];\n`;
    
    // Replace the old sponsors array with the new one
    const updatedContent = pageContent.substring(0, startIndex) + newSponsorsCode + pageContent.substring(endIndex);
    
    // Write the updated content back to the file
    fs.writeFileSync(sponsorsFilePath, updatedContent);
    
    log('Successfully updated sponsors data in the React component.', true);
    return true;
  } catch (error) {
    console.error('Error updating sponsors data:', error.message);
    return false;
  }
}

// Display summary of changes
function displaySummary(companies, logoResults) {
  console.log('\n===== SUMMARY =====');
  console.log(`Total companies found: ${companies.length}`);
  
  const successLogos = logoResults.filter(r => r.success).length;
  console.log(`Logos processed: ${successLogos} successful, ${logoResults.length - successLogos} failed`);
  
  if (CONFIG.TEST_MODE) {
    console.log('TEST MODE was enabled, no actual changes were made.');
  } else {
    console.log('Changes have been applied to:');
    console.log(`- Sponsor logos in ${logosDir}`);
    console.log(`- Sponsor data in ${sponsorsFilePath}`);
  }
  
  console.log('\nNext steps:');
  console.log('1. Run the development server to verify the changes: npm run dev');
  console.log('2. Check the sponsors page to ensure all logos display correctly');
  console.log('====================');
}

// Main function to execute the script
async function main() {
  try {
    // Display banner
    console.log('\n===== SJSU ASCE Website Company Logo Updater =====');
    if (CONFIG.TEST_MODE) {
      console.log('RUNNING IN TEST MODE - No files will be modified');
    }
    console.log('===================================================\n');
    
    // Create necessary directories
    await createDirectories();
    
    // Fetch companies from Google Sheet
    const companies = await fetchCompaniesFromSheet();
    
    if (companies.length === 0) {
      console.error('No companies found in the sheet. Exiting.');
      return;
    }
    
    // Find logos for each company
    const logoResults = [];
    for (const company of companies) {
      const result = await searchCompanyLogo(company);
      logoResults.push(result);
    }
    
    // Update the sponsors data in the React component
    await updateSponsorsData(companies);
    
    // Display summary of changes
    displaySummary(companies, logoResults);
    
    log('Script completed successfully!', true);
  } catch (error) {
    console.error('Error running script:', error.message);
  }
}

// Check if script is being run directly
if (require.main === module) {
  main();
} else {
  // Export functions for testing or importing
  module.exports = {
    fetchCompaniesFromSheet,
    searchCompanyLogo,
    updateSponsorsData
  };
} 