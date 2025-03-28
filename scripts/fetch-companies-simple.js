// A simpler script that uses hardcoded company names from the spreadsheet

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Directory where the logos will be saved
const logosDir = path.join(__dirname, '../public/images/sponsors');
const sponsorsFilePath = path.join(__dirname, '../app/sponsors/page.tsx');

// Default fallback logo when none can be found
const placeholderPath = path.join(logosDir, 'company-placeholder.svg');

// Create the directory if it doesn't exist
async function createDirectories() {
  try {
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
      console.log(`Created directory: ${logosDir}`);
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

// Hardcoded company list from the spreadsheet
const companies = [
  // Construction Management
  { name: 'City of San Jose, Public Works Department', section: 'Construction Management', website: 'https://www.sanjoseca.gov/your-government/departments/public-works' },
  { name: 'DeSilva Gates Construction', section: 'Construction Management', website: 'https://desilvagates.com/' },
  { name: 'Graniterock', section: 'Construction Management', website: 'https://www.graniterock.com/' },
  { name: 'Level 10 Construction', section: 'Construction Management', website: 'https://www.level10gc.com/' },
  { name: 'McGuire and Hester', section: 'Construction Management', website: 'https://www.mcguireandhester.com/' },
  { name: 'Performance Contracting, Inc.', section: 'Construction Management', website: 'https://www.pcg.com/' },
  { name: 'Rodan Builders, Inc.', section: 'Construction Management', website: 'https://www.rodanbuilders.com/' },
  { name: 'Rudolph and Sletten, Inc.', section: 'Construction Management', website: 'https://www.rsconstruction.com/' },
  { name: 'Simpson Gumpertz & Heger', section: 'Construction Management', website: 'https://www.sgh.com/' },
  { name: 'Technical Builders', section: 'Construction Management', website: 'https://www.technicalbuilders.com/' },
  { name: 'The CORE Group', section: 'Construction Management', website: 'https://www.coregroupus.com/' },
  { name: 'Vulcan Materials Company', section: 'Construction Management', website: 'https://www.vulcanmaterials.com/' },
  { name: 'Whiting-Turner', section: 'Construction Management', website: 'https://www.whiting-turner.com/' },
  { name: 'XL Construction', section: 'Construction Management', website: 'https://www.xlconstruction.com/' },
  
  // Structural
  { name: 'City of San Jose, Public Works Department', section: 'Structural', website: 'https://www.sanjoseca.gov/your-government/departments/public-works' },
  { name: 'Kpff', section: 'Structural', website: 'https://www.kpff.com/' },
  { name: 'Mark Thomas', section: 'Structural', website: 'https://www.markthomas.com/' },
  { name: 'McGuire and Hester', section: 'Structural', website: 'https://www.mcguireandhester.com/' },
  { name: 'PASE', section: 'Structural', website: 'https://pasecivil.com/' },
  { name: 'Simpson Gumpertz & Heger', section: 'Structural', website: 'https://www.sgh.com/' },
  { name: 'XL Construction', section: 'Structural', website: 'https://www.xlconstruction.com/' },
  
  // Environmental
  { name: 'City of San Jose, Public Works Department', section: 'Environmental', website: 'https://www.sanjoseca.gov/your-government/departments/public-works' },
  { name: 'Schaaf & Wheeler Consulting Civil Engineers', section: 'Environmental', website: 'https://www.swsv.com/' },
  { name: 'Simpson Gumpertz & Heger', section: 'Environmental', website: 'https://www.sgh.com/' },
  { name: 'XL Construction', section: 'Environmental', website: 'https://www.xlconstruction.com/' },
  { name: 'Vulcan Materials Company', section: 'Environmental', website: 'https://www.vulcanmaterials.com/' },
  
  // Transportation
  { name: 'HMH Engineers', section: 'Transportation', website: 'https://hmhca.com/' },
  { name: 'Kpff', section: 'Transportation', website: 'https://www.kpff.com/' },
  { name: 'Mark Thomas', section: 'Transportation', website: 'https://www.markthomas.com/' },
  { name: 'NTK Construction, Inc.', section: 'Transportation', website: 'https://ntkconstruction.com/' },
  
  // Water Resources
  { name: 'City of San Jose, Public Works Department', section: 'Water Resources', website: 'https://www.sanjoseca.gov/your-government/departments/public-works' },
  { name: 'Kpff', section: 'Water Resources', website: 'https://www.kpff.com/' },
  { name: 'NTK Construction, Inc.', section: 'Water Resources', website: 'https://ntkconstruction.com/' },
  { name: 'Schaaf & Wheeler Consulting Civil Engineers', section: 'Water Resources', website: 'https://www.swsv.com/' },
  
  // Geotechnical
  { name: 'City of San Jose, Public Works Department', section: 'Geotechnical', website: 'https://www.sanjoseca.gov/your-government/departments/public-works' },
  { name: 'Simpson Gumpertz & Heger', section: 'Geotechnical', website: 'https://www.sgh.com/' },
  
  // Land Development
  { name: 'Carlson, Barbee & Gibson, Inc. (CBG)', section: 'Land Development', website: 'https://cbandg.com/' },
  { name: 'Civil Engineering Associates, Inc.', section: 'Land Development', website: 'https://www.civilengineeringassociates.com/' },
  { name: 'Ruggeri-Jensen-Azar', section: 'Land Development', website: 'https://www.rja-gps.com/' },
  
  // Heavy Civil
  { name: 'McGuire and Hester', section: 'Heavy Civil', website: 'https://www.mcguireandhester.com/' },
  
  // Civil Engineering
  { name: 'Carlson, Barbee & Gibson, Inc. (CBG)', section: 'Civil Engineering', website: 'https://cbandg.com/' },
  { name: 'HMH Engineers', section: 'Civil Engineering', website: 'https://hmhca.com/' },
  { name: 'Kpff', section: 'Civil Engineering', website: 'https://www.kpff.com/' },
  { name: 'Schaaf & Wheeler Consulting Civil Engineers', section: 'Civil Engineering', website: 'https://www.swsv.com/' },
  
  // Mining
  { name: 'Vulcan Materials Company', section: 'Mining', website: 'https://www.vulcanmaterials.com/' },
  
  // Utilities
  { name: 'City of Palo Alto', section: 'Utilities', website: 'https://www.cityofpaloalto.org/' }
];

// Create a placeholder SVG with company name
async function createCustomPlaceholder(safeName, companyName) {
  try {
    const outputPath = path.join(logosDir, `${safeName}.svg`);
    
    // Skip if file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Placeholder for ${companyName} already exists. Skipping...`);
      return true;
    }
    
    // Read the base placeholder SVG template
    let svgTemplate = fs.readFileSync(placeholderPath, 'utf8');
    
    // Replace the text with company name
    const displayName = companyName.length > 20 ? 
                        companyName.substring(0, 18) + '...' : 
                        companyName;
                        
    svgTemplate = svgTemplate.replace('>COMPANY<', `>${displayName}<`);
    
    // Write the custom SVG to a file
    fs.writeFileSync(outputPath, svgTemplate);
    console.log(`Created custom placeholder for ${companyName}`);
    return true;
  } catch (error) {
    console.error(`Error creating placeholder for ${companyName}:`, error.message);
    return false;
  }
}

// Search for logo using Clearbit API
async function searchCompanyLogo(company) {
  try {
    const companyName = company.name;
    const safeName = getFilenameFromCompany(companyName);
    const logoFilePng = path.join(logosDir, `${safeName}.png`);
    const logoFileSvg = path.join(logosDir, `${safeName}.svg`);
    
    // If logo already exists, skip
    if (fs.existsSync(logoFilePng) || fs.existsSync(logoFileSvg)) {
      console.log(`Logo for ${companyName} already exists. Skipping...`);
      return { success: true, filename: fs.existsSync(logoFilePng) ? `${safeName}.png` : `${safeName}.svg` };
    }
    
    console.log(`Looking for logo: ${companyName}`);
    
    // Extract domain from website if available
    let domain = '';
    if (company.website) {
      try {
        const websiteUrl = company.website.startsWith('http') ? 
                         company.website : 
                         `https://${company.website}`;
        
        const url = new URL(websiteUrl);
        domain = url.hostname.replace('www.', '');
        
        if (domain) {
          const clearbitUrl = `https://logo.clearbit.com/${domain}?size=128`;
          
          try {
            // Check if logo exists
            const response = await axios.head(clearbitUrl);
            
            if (response.status === 200) {
              // Download the logo
              const logoResponse = await axios({
                method: 'get',
                url: clearbitUrl,
                responseType: 'stream'
              });
              
              const writer = fs.createWriteStream(logoFilePng);
              logoResponse.data.pipe(writer);
              
              await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
              });
              
              console.log(`Downloaded logo for ${companyName} from Clearbit`);
              return { success: true, filename: `${safeName}.png` };
            }
          } catch (err) {
            console.log(`No logo found at Clearbit for ${domain}`);
          }
        }
      } catch (err) {
        console.log(`Invalid website URL for ${companyName}: ${company.website}`);
      }
    }
    
    // If no logo found, create placeholder
    await createCustomPlaceholder(safeName, companyName);
    return { success: true, filename: `${safeName}.svg` };
  } catch (error) {
    console.error(`Error finding logo for ${company.name}:`, error.message);
    return { success: false, filename: null };
  }
}

// Update the sponsors data in the React component
async function updateSponsorsData() {
  try {
    console.log('Updating sponsors data in the React component...');
    
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
    
    // Group companies by uniqueness (avoid duplicates)
    const uniqueCompanies = {};
    companies.forEach(company => {
      const key = getFilenameFromCompany(company.name);
      if (!uniqueCompanies[key]) {
        uniqueCompanies[key] = company;
      }
    });
    
    // Convert back to array
    const uniqueCompanyList = Object.values(uniqueCompanies);
    
    let id = 1;
    let currentSection = '';
    
    for (const company of uniqueCompanyList) {
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
    
    console.log(`Successfully updated sponsors data with ${uniqueCompanyList.length} unique companies.`);
    return true;
  } catch (error) {
    console.error('Error updating sponsors data:', error.message);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting company logo and data update process...');
    
    // Create necessary directories
    await createDirectories();
    
    // Process each company
    for (const company of companies) {
      await searchCompanyLogo(company);
    }
    
    // Update the sponsor data in the react component
    await updateSponsorsData();
    
    console.log('Script completed successfully!');
    console.log('Run "npm run dev" to see the updated sponsor page.');
  } catch (error) {
    console.error('Error running script:', error.message);
  }
}

// Run the main function
main(); 