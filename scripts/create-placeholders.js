// This script creates placeholder SVG images for all companies

const fs = require('fs');
const path = require('path');

// List of company names from the sponsors page
const companyNames = [
  'city-of-san-jose',
  'desilva-gates',
  'graniterock',
  'level10',
  'mcguire-hester',
  'pci',
  'rodan',
  'rudolph-sletten',
  'sgh',
  'technical-builders',
  'core-group',
  'vulcan',
  'whiting-turner',
  'xl-construction',
  'kpff',
  'mark-thomas',
  'pase',
  'schaaf-wheeler',
  'hmh',
  'ntk',
  'cbg',
  'civil-engineering-associates',
  'rja',
  'palo-alto'
];

// Directory where the placeholder SVGs will be saved
const sponsorsDir = path.join(__dirname, '../public/images/sponsors');
const placeholderPath = path.join(sponsorsDir, 'company-placeholder.svg');

// Make sure the sponsors directory exists
if (!fs.existsSync(sponsorsDir)) {
  fs.mkdirSync(sponsorsDir, { recursive: true });
  console.log(`Created directory: ${sponsorsDir}`);
}

// Create a placeholder SVG for company if it doesn't exist
function createPlaceholderSVG(companyName) {
  const companyPath = path.join(sponsorsDir, `${companyName}.svg`);
  
  // Skip if the company already has a logo file
  const extensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
  let exists = false;
  
  for (const ext of extensions) {
    if (fs.existsSync(path.join(sponsorsDir, `${companyName}.${ext}`))) {
      exists = true;
      console.log(`Logo already exists for ${companyName}`);
      break;
    }
  }
  
  if (!exists) {
    // Read the placeholder SVG template
    try {
      const svgTemplate = fs.readFileSync(placeholderPath, 'utf8');
      
      // Replace "COMPANY" with the actual company name (formatted)
      const formattedName = companyName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      const customSVG = svgTemplate.replace('>COMPANY<', `>${formattedName}<`);
      
      // Write the custom SVG to a new file
      fs.writeFileSync(companyPath, customSVG);
      console.log(`Created placeholder SVG for ${companyName}`);
    } catch (error) {
      console.error(`Error creating placeholder for ${companyName}:`, error.message);
    }
  }
}

// Main function
async function createPlaceholders() {
  console.log(`Creating placeholder SVGs in ${sponsorsDir}...`);
  
  for (const companyName of companyNames) {
    createPlaceholderSVG(companyName);
  }
  
  console.log('Placeholder creation completed!');
}

// Run the creation process
createPlaceholders(); 