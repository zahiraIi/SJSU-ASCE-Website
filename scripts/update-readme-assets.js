#!/usr/bin/env node

/**
 * This script downloads necessary images from the Cloudflare R2 bucket
 * and stores them in the assets directory so they can be used in the README.md
 * 
 * Usage: 
 * npm run update-readme-assets
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Configuration
const R2_BASE_URL = 'https://r2.sjsuasce.com/';
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'readme');
const IMAGES_TO_DOWNLOAD = [
  {
    source: 'FGM Pics/possiblefrontpage.JPG',
    destination: 'team-photo.jpg',
    description: 'SJSU ASCE Team photo'
  },
  {
    source: 'ASCELOGO/ASCE.png',
    destination: 'logo.png',
    description: 'SJSU ASCE Logo'
  }
  // Add more images as needed
];

// Create assets directory if it doesn't exist
console.log('Creating assets directory...');
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  console.log(`Created directory: ${ASSETS_DIR}`);
}

// Function to download an image
function downloadImage(sourceUrl, destinationPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${sourceUrl}`);
    
    const file = fs.createWriteStream(destinationPath);
    https.get(sourceUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download image: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${destinationPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destinationPath, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Function to update README.md with local image paths
function updateReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let readmeContent = fs.readFileSync(readmePath, 'utf8');
  
  // Update image paths in README
  IMAGES_TO_DOWNLOAD.forEach(image => {
    const r2Url = `${R2_BASE_URL}${encodeURIComponent(image.source)}`;
    const localPath = `assets/readme/${image.destination}`;
    
    // Replace R2 URLs with local paths
    const r2Pattern = new RegExp(`src="https://r2.sjsuasce.com/${image.source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    readmeContent = readmeContent.replace(r2Pattern, `src="./${localPath}"`);
    
    // Also try with URL-encoded version
    const encodedPattern = new RegExp(`src="https://r2.sjsuasce.com/${encodeURIComponent(image.source).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
    readmeContent = readmeContent.replace(encodedPattern, `src="./${localPath}"`);
  });
  
  // Uncomment the website screenshot section if it exists
  readmeContent = readmeContent.replace(
    /<!-- The image below is commented out.*?\n<!--/s,
    '<!-- Website Screenshot -->'
  );
  
  readmeContent = readmeContent.replace(/-->\s*$/m, '');
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('Updated README.md with local image paths');
}

// Main function
async function main() {
  try {
    // Download all images
    for (const image of IMAGES_TO_DOWNLOAD) {
      const sourceUrl = `${R2_BASE_URL}${encodeURIComponent(image.source)}`;
      const destinationPath = path.join(ASSETS_DIR, image.destination);
      await downloadImage(sourceUrl, destinationPath);
    }
    
    // Update README.md
    updateReadme();
    
    // Create a screenshot of the website if possible
    try {
      console.log('Attempting to create a website screenshot...');
      // This requires puppeteer to be installed
      execSync('npx screenshot-website https://sjsu-asce-website.vercel.app --output ./assets/readme/website-screenshot.jpg --width 1200 --height 630 --type jpg');
      console.log('Created website screenshot');
    } catch (error) {
      console.log('Could not create website screenshot automatically. Please create one manually.');
      console.log('Error:', error.message);
    }
    
    console.log('\nDone! README assets have been updated.');
    console.log('If you see this script running in a GitHub Action, make sure to commit and push the changes.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main(); 