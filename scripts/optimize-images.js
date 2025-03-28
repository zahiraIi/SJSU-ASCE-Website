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

// Function to process images
async function processImages() {
  try {
    // Recursively scan all subdirectories
    const processDirectory = async (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await processDirectory(fullPath);
        } else if (isImageFile(entry.name)) {
          await optimizeImage(fullPath, entry.name);
        }
      }
    };
    
    await processDirectory(sourceDir);
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

// Check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}

// Optimize a single image
async function optimizeImage(sourcePath, filename) {
  try {
    const outputPath = path.join(destDir, filename);
    
    // Create a properly sized version for officer cards (aspect ratio preserved)
    await sharp(sourcePath)
      .resize({
        width: 400,        // Reasonable width for card images
        height: 600,       // Reasonable height while maintaining aspect ratio
        fit: 'cover',      // Crop to fill the dimensions
        position: 'center' // Focus on center of image (face usually there)
      })
      .webp({ quality: 85 }) // Convert to WebP for better compression
      .toFile(`${outputPath.replace(/\.[^/.]+$/, '')}.webp`);
    
    // Create a fallback JPEG version for browsers that don't support WebP
    await sharp(sourcePath)
      .resize({
        width: 400,
        height: 600,
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(`${outputPath.replace(/\.[^/.]+$/, '')}.jpg`);
    
    console.log(`Optimized: ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Run the optimization
processImages(); 