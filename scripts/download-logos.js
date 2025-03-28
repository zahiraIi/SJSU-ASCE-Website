// This script helps download company logos for sponsors

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

// List of companies and their logo URLs
// Replace these URLs with actual logo URLs when available
const companies = [
  { name: 'city-of-san-jose', url: 'https://www.sanjoseca.gov/Home/ShowPublishedImage/5827/637030415126970000' },
  { name: 'desilva-gates', url: 'https://desilvagates.com/wp-content/uploads/2017/09/DGC_LOGO.png' },
  { name: 'graniterock', url: 'https://www.graniterock.com/sites/all/themes/graniterock/img/graniterock-blue-logo.svg' },
  { name: 'level10', url: 'https://www.level10gc.com/wp-content/uploads/2018/02/Level-10-Logo-e1539369698501.png' },
  { name: 'mcguire-hester', url: 'https://www.mcguireandhester.com/wp-content/uploads/2018/10/McGuireHester-300x300.png' },
  { name: 'pci', url: 'https://www.pcg.com/images/PCIlogo-01.svg' },
  { name: 'rodan', url: 'https://www.rodanbuilders.com/wp-content/uploads/2019/06/Rodan-Builders-Logo.png' },
  { name: 'rudolph-sletten', url: 'https://www.rsconstruction.com/sites/default/files/rs-logo.svg' },
  { name: 'sgh', url: 'https://www.sgh.com/sites/default/files/SGH_Logo_RGB.png' },
  { name: 'technical-builders', url: 'https://www.technicalbuilders.com/wp-content/uploads/2021/06/TBI-Wordmark.png' },
  { name: 'core-group', url: 'https://www.coregroupus.com/wp-content/uploads/2022/03/core-logo-small-1.png' },
  { name: 'vulcan', url: 'https://www.vulcanmaterials.com/Content/images/vmcLogo.png' },
  { name: 'whiting-turner', url: 'https://www.whiting-turner.com/wp-content/themes/whiting-turner/assets/images/logo.svg' },
  { name: 'xl-construction', url: 'https://www.xlconstruction.com/wp-content/uploads/2020/06/xl-construction-logo.svg' },
  { name: 'kpff', url: 'https://www.kpff.com/images/logo.png' },
  { name: 'mark-thomas', url: 'https://www.markthomas.com/wp-content/uploads/2020/12/MT-Logo-RGB-Dark-Blue.png' },
  { name: 'pase', url: 'https://pasecivil.com/wp-content/uploads/2018/07/Pase-logo-1.png' },
  { name: 'schaaf-wheeler', url: 'https://www.swsv.com/wp-content/uploads/2022/07/Schaaf-Wheeler-Logo-1.png' },
  { name: 'hmh', url: 'https://hmhca.com/wp-content/uploads/2020/05/HMH-Logo-Horizontal-RGB.png' },
  { name: 'ntk', url: 'https://ntkconstruction.com/wp-content/uploads/2019/08/NTK-New-Logo-1.jpg' },
  { name: 'cbg', url: 'https://cbandg.com/wp-content/uploads/2019/01/cbg-logo-blue.png' },
  { name: 'civil-engineering-associates', url: 'https://www.civilengineeringassociates.com/wp-content/uploads/2020/02/cea-logo-blue.png' },
  { name: 'rja', url: 'https://www.rja-gps.com/wp-content/uploads/2020/03/RJA_logo.png' },
  { name: 'palo-alto', url: 'https://www.cityofpaloalto.org/files/assets/public/communications/city-of-palo-alto-logo.png' },
];

// Directory where the logos will be saved
const logosDir = path.join(__dirname, '../public/images/sponsors');

// Create the directory if it doesn't exist
async function createDirectories() {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(logosDir)) {
      fs.mkdirSync(logosDir, { recursive: true });
      console.log(`Created directory: ${logosDir}`);
    } else {
      console.log(`Directory already exists: ${logosDir}`);
    }
  } catch (err) {
    console.error('Error creating directory:', err);
  }
}

// Log which companies don't have logo files already
function checkExistingLogos() {
  console.log('Checking for existing logo files...');
  const missingLogos = [];
  
  companies.forEach(company => {
    // Check common extensions
    const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
    let exists = false;
    
    for (const ext of extensions) {
      const filePath = path.join(logosDir, `${company.name}.${ext}`);
      if (fs.existsSync(filePath)) {
        exists = true;
        console.log(`Found: ${company.name}.${ext}`);
        break;
      }
    }
    
    if (!exists) {
      missingLogos.push(company.name);
    }
  });
  
  if (missingLogos.length > 0) {
    console.log('\nMissing logos for these companies:');
    missingLogos.forEach(name => console.log(`- ${name}`));
    console.log();
  } else {
    console.log('All company logos exist!');
  }
}

// Download a logo from a URL
function downloadLogo(company) {
  return new Promise((resolve, reject) => {
    const fileName = `${company.name}.${getFileExtension(company.url)}`;
    const filePath = path.join(logosDir, fileName);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Logo for ${company.name} already exists. Skipping...`);
      return resolve();
    }
    
    const protocol = company.url.startsWith('https') ? https : http;
    
    console.log(`Downloading logo for ${company.name}...`);
    
    const request = protocol.get(company.url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close(() => {
            console.log(`Downloaded logo for ${company.name}`);
            resolve();
          });
        });
        
        file.on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      } else if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirects
        console.log(`Following redirect for ${company.name}...`);
        const redirectUrl = response.headers.location;
        company.url = redirectUrl;
        downloadLogo(company).then(resolve).catch(reject);
      } else {
        reject(new Error(`Failed to download logo for ${company.name}. Status code: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Get the file extension from a URL
function getFileExtension(url) {
  const parsedUrl = new URL(url);
  const pathname = parsedUrl.pathname;
  const extension = path.extname(pathname).substring(1);
  
  // Default to png if no extension is found
  return extension || 'png';
}

// Create a simple fallback logo for companies that fail to download
function createFallbackLogo(companyName) {
  const fallbackPath = path.join(logosDir, `${companyName}.png`);
  
  // Skip if file already exists
  if (fs.existsSync(fallbackPath)) {
    return;
  }
  
  // Copy the placeholder to a company-specific file
  const placeholderPath = path.join(logosDir, 'company-placeholder.svg');
  if (fs.existsSync(placeholderPath)) {
    fs.copyFileSync(placeholderPath, fallbackPath);
    console.log(`Created fallback logo for ${companyName}`);
  }
}

// Main function to download all logos
async function downloadLogos() {
  try {
    await createDirectories();
    
    // Check existing logos first
    checkExistingLogos();
    
    for (const company of companies) {
      try {
        await downloadLogo(company);
      } catch (error) {
        console.error(`Error downloading logo for ${company.name}:`, error.message);
        createFallbackLogo(company.name);
      }
    }
    
    console.log('All available logos downloaded successfully!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the download process
downloadLogos(); 