const { execSync } = require('child_process');
const path = require('path');

console.log('=== SJSU ASCE Website Image Processing ===');
console.log('This script will:');
console.log('1. Convert all media files to JPG format');
console.log('2. Optimize all JPG files for web display\n');

// Define script paths relative to this file
const convertScript = path.join(__dirname, 'convert-all-media.js');
const optimizeScript = path.join(__dirname, 'optimize-all-images.js');

try {
  // Step 1: Convert all media files
  console.log('Step 1: Converting all media files to JPG format...');
  execSync(`node ${convertScript}`, { stdio: 'inherit' });
  
  console.log('\n');
  
  // Step 2: Optimize all JPG files
  console.log('Step 2: Optimizing all JPG files for web display...');
  execSync(`node ${optimizeScript}`, { stdio: 'inherit' });
  
  console.log('\n=== All image processing completed successfully! ===');
  console.log('Converted images are in {folder}/jpg directories');
  console.log('Optimized images are in public/images/optimized/{folder} directories');

} catch (error) {
  console.error('Error processing images:', error.message);
  process.exit(1);
} 