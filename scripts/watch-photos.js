const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const { exec } = require('child_process');

// Base photos directory to watch
const basePhotosDir = path.join(__dirname, '../public/images/Photos');

// Check if a file is a supported media file that needs conversion
function isSupportedMediaFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.heic', '.png', '.webp'].includes(ext);
}

// Check if a file is an image that needs optimization
function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext);
}

// Process a file when it's added or changed
function processFile(filePath) {
  // Skip files in the 'jpg' subdirectory (they'll be processed differently)
  if (filePath.includes('/jpg/')) {
    return;
  }
  
  console.log(`File change detected: ${filePath}`);
  
  if (isSupportedMediaFile(filePath)) {
    // For HEIC files, first run the convert script
    console.log(`Converting media file: ${filePath}`);
    exec(`node ${path.join(__dirname, 'convert-all-media.js')}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error converting media: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }
      console.log(`Media conversion complete: ${stdout}`);
      
      // After conversion, optimize the result
      setTimeout(() => {
        console.log('Now optimizing converted file...');
        runOptimizeScript();
      }, 1000); // Wait a second before optimizing to ensure file system updates
    });
  } else if (isImageFile(filePath)) {
    // For regular image files, just run the optimize script
    console.log(`Optimizing image file: ${filePath}`);
    runOptimizeScript();
  }
}

// Run the optimization script
function runOptimizeScript() {
  exec(`node ${path.join(__dirname, 'optimize-photos.js')}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error optimizing images: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    console.log(`Image optimization complete: ${stdout}`);
  });
}

// Set up the file watcher
console.log(`Starting to watch ${basePhotosDir} for changes...`);

// Initialize watcher
const watcher = chokidar.watch(basePhotosDir, {
  persistent: true,
  ignoreInitial: false,  // Process existing files
  ignored: [
    /(^|[\/\\])\../,     // Ignore dot files
    '**/node_modules/**' // Ignore node_modules
  ],
  awaitWriteFinish: {    // Wait until the file is fully written
    stabilityThreshold: 2000,
    pollInterval: 100
  }
});

// Process initial files then set up watchers
let initialScanComplete = false;

watcher
  .on('add', filePath => {
    if (!initialScanComplete) {
      console.log(`Initial scan: ${filePath}`);
      return; // During initial scan, just log found files but don't process them
    }
    processFile(filePath);
  })
  .on('change', filePath => {
    if (initialScanComplete) {
      processFile(filePath);
    }
  })
  .on('ready', () => {
    initialScanComplete = true;
    console.log('Initial scan complete. Running one-time processing of all files...');
    
    // Run both scripts once at startup to process any existing files
    exec(`node ${path.join(__dirname, 'convert-all-media.js')}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error during initial conversion: ${error.message}`);
        return;
      }
      console.log(`Initial conversion complete.`);
      
      // After conversion, run optimization
      console.log('Now running initial optimization...');
      runOptimizeScript();
    });
    
    console.log('Now watching for file changes...');
  })
  .on('error', error => console.error(`Watcher error: ${error}`));

console.log('Watcher started! Press Ctrl+C to stop.');

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Stopping file watcher...');
  watcher.close().then(() => {
    console.log('File watcher stopped.');
    process.exit(0);
  });
}); 