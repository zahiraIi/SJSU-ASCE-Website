const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Define source and destination directories
const sourceDir = path.join(__dirname, '../public/images/Photos/New Officer Photos');
const destDir = path.join(__dirname, '../public/images/officers');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Simple version that just copies original files
async function processImages() {
  try {
    // Find all officer images
    const findOfficerImages = (dir) => {
      const files = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        
        if (item.isDirectory()) {
          files.push(...findOfficerImages(fullPath));
        } else if (['.jpg', '.jpeg', '.png'].includes(path.extname(item.name).toLowerCase())) {
          files.push(fullPath);
        }
      }
      
      return files;
    };
    
    // Get all images
    const images = findOfficerImages(sourceDir);
    console.log(`Found ${images.length} images`);
    
    // Process each image
    for (const imagePath of images) {
      const fileName = path.basename(imagePath);
      const destPath = path.join(destDir, fileName);
      
      // Just copy the file
      fs.copyFileSync(imagePath, destPath);
      console.log(`Copied: ${fileName}`);
    }
    
    console.log('Image copying complete!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

// Run the script
processImages(); 