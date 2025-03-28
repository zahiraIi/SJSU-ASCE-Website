const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Base source and destination directories
const basePhotosDir = path.join(__dirname, '../public/images/Photos');
const baseOptimizedDir = path.join(__dirname, '../public/images/optimized');

// Create base destination directory if it doesn't exist
if (!fs.existsSync(baseOptimizedDir)) {
  fs.mkdirSync(baseOptimizedDir, { recursive: true });
}

// Function to process a single directory
async function processDirectory(dirName) {
  // Set up source and destination directories
  const sourceDir = path.join(basePhotosDir, dirName, 'jpg');
  const destDir = path.join(baseOptimizedDir, dirName);
  
  console.log(`\n=== Processing directory: ${dirName} ===`);
  
  // Skip if source directory doesn't exist
  if (!fs.existsSync(sourceDir)) {
    console.log(`No jpg directory exists for: ${dirName}`);
    return;
  }
  
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created destination directory: ${destDir}`);
  }
  
  try {
    // Read all files in the source directory
    const files = await fs.promises.readdir(sourceDir);
    
    // Filter for image files
    const imageFiles = files.filter(file => isImageFile(file));
    
    if (imageFiles.length === 0) {
      console.log(`No image files found in ${dirName}/jpg`);
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize in ${dirName}/jpg`);
    
    // Process all files
    const promises = imageFiles.map(file => {
      const sourcePath = path.join(sourceDir, file);
      return optimizeImage(sourcePath, file, destDir);
    });
    
    await Promise.all(promises);
    
    console.log(`Completed optimization in directory: ${dirName}`);
  } catch (error) {
    console.error(`Error processing directory ${dirName}:`, error);
  }
}

// Check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}

// Optimize a single image
async function optimizeImage(sourcePath, filename, destDir) {
  try {
    const baseName = path.parse(filename).name;
    
    // Skip if both optimized versions already exist
    const webpPath = path.join(destDir, `${baseName}.webp`);
    const jpgPath = path.join(destDir, `${baseName}.jpg`);
    
    if (fs.existsSync(webpPath) && fs.existsSync(jpgPath)) {
      console.log(`Skipping ${filename} - already optimized`);
      return;
    }
    
    console.log(`Optimizing: ${filename}`);
    
    // Create a standard optimized version
    // Create WebP version (modern browsers)
    await sharp(sourcePath)
      .resize({
        width: 1200,       // Reasonable width for web display
        height: 900,       // Reasonable height
        fit: 'inside',     // Keep aspect ratio
        withoutEnlargement: true // Don't enlarge small images
      })
      .webp({ quality: 85 }) // Convert to WebP for better compression
      .toFile(webpPath);
    
    // Create a fallback JPEG version for browsers that don't support WebP
    await sharp(sourcePath)
      .resize({
        width: 1200,
        height: 900,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, progressive: true })
      .toFile(jpgPath);
    
    console.log(`Optimized: ${filename}`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error);
  }
}

// Main function to optimize all images
async function optimizeAllImages() {
  try {
    console.log('Starting image optimization across all directories...');
    
    // Get all directories in the Photos folder
    const dirs = await fs.promises.readdir(basePhotosDir);
    
    // Filter out files and non-directories
    const photoDirs = dirs.filter(dir => {
      const fullPath = path.join(basePhotosDir, dir);
      return fs.statSync(fullPath).isDirectory();
    });
    
    console.log(`Found ${photoDirs.length} directories to process`);
    
    // Process each directory separately
    for (const dir of photoDirs) {
      await processDirectory(dir);
    }
    
    console.log('\nAll image optimization complete!');
  } catch (error) {
    console.error('Error in image optimization process:', error);
  }
}

// Run the optimization
optimizeAllImages(); 