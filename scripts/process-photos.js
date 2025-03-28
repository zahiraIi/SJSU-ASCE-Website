const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Define script paths relative to this file
const convertScript = path.join(__dirname, 'convert-all-media.js');
const optimizeScript = path.join(__dirname, 'optimize-photos.js');

console.log('=== SJSU ASCE Website Image Processing ===');
console.log('This script will:');
console.log('1. Convert all HEIC and other media files to JPG format (deleting originals)');
console.log('2. Optimize all images in place (with backups)\n');

// Check for required NPM packages
function checkDependencies() {
  try {
    const requiredPackages = ['sharp', 'heic-convert'];
    const missingPackages = [];
    
    for (const pkg of requiredPackages) {
      try {
        require(pkg);
      } catch (err) {
        missingPackages.push(pkg);
      }
    }
    
    if (missingPackages.length > 0) {
      console.log('Installing missing dependencies: ' + missingPackages.join(', '));
      execSync(`npm install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
      console.log('Dependencies installed successfully.\n');
    }
  } catch (error) {
    console.error('Error checking dependencies:', error);
    process.exit(1);
  }
}

// Main process function
async function processPhotos() {
  try {
    // Step 1: Check dependencies
    checkDependencies();
    
    // Step 2: Convert all media files (will delete HEIC files)
    console.log('Step 1: Converting all media files to JPG format...');
    execSync(`node ${convertScript}`, { stdio: 'inherit' });
    
    console.log('\n');
    
    // Step 3: Optimize all JPG files in place
    console.log('Step 2: Optimizing all JPG files in place...');
    execSync(`node ${optimizeScript}`, { stdio: 'inherit' });
    
    console.log('\n=== All image processing completed successfully! ===');
    console.log('1. HEIC files have been converted to JPG and originals deleted');
    console.log('2. All images have been optimized in place');
    console.log('3. Original files were backed up to the ../backup/images directory');
    
    // Provide a helpful command to clean up backup files if needed
    console.log('\nTo remove backup files (if you no longer need them):');
    console.log('rm -rf ../backup/images');

  } catch (error) {
    console.error('Error processing images:', error.message);
    process.exit(1);
  }
}

// Run the main function
processPhotos(); 