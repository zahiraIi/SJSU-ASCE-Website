const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const heicConvert = require('heic-convert');
const { promisify } = require('util');

// Base photos directory
const basePhotosDir = path.join(__dirname, '../public/images/Photos');

// Supported file extensions for conversion
const supportedExtensions = ['.heic', '.HEIC', '.png', '.PNG', '.webp', '.WEBP'];

// Function to convert HEIC to JPEG Buffer
async function heicToJpegBuffer(inputBuffer) {
  try {
    const jpegBuffer = await heicConvert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.85
    });
    return jpegBuffer;
  } catch (error) {
    console.error('Error converting HEIC to JPEG buffer:', error);
    throw error;
  }
}

// Function to process a single file
async function processFile(filePath, fileName, destDir) {
  try {
    // Extract just the base name without any extension
    const baseName = path.parse(fileName).name;
    const outputPath = path.join(destDir, `${baseName}.jpg`);
    
    // Skip if output file already exists and is newer than the source file
    if (fs.existsSync(outputPath)) {
      const sourceStats = fs.statSync(filePath);
      const destStats = fs.statSync(outputPath);
      
      if (destStats.mtimeMs > sourceStats.mtimeMs) {
        console.log(`Skipping ${fileName} - already converted and up to date`);
        
        // Delete original file after skipping
        if (path.extname(fileName).toLowerCase() === '.heic') {
          try {
            fs.unlinkSync(filePath);
            console.log(`Deleted original: ${fileName}`);
          } catch (err) {
            console.error(`Error deleting original file ${fileName}:`, err);
          }
        }
        
        return;
      }
    }
    
    console.log(`Processing: ${fileName}`);
    
    // Read the file
    const inputBuffer = await fs.promises.readFile(filePath);
    
    let outputBuffer;
    
    // Handle different file types
    const ext = path.extname(fileName).toLowerCase();
    if (ext === '.heic') {
      // Convert HEIC to JPEG buffer
      outputBuffer = await heicToJpegBuffer(inputBuffer);
    } else {
      // Use sharp for other supported formats
      outputBuffer = await sharp(inputBuffer)
        .jpeg({ quality: 85 })
        .toBuffer();
    }
    
    // Resize the image to a reasonable size while maintaining aspect ratio
    outputBuffer = await sharp(outputBuffer)
      .resize({
        width: 1800,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
    
    // Write output file
    await fs.promises.writeFile(outputPath, outputBuffer);
    console.log(`Converted: ${fileName} → ${baseName}.jpg`);
    
    // Delete original file after successful conversion
    if (path.extname(fileName).toLowerCase() === '.heic') {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted original: ${fileName}`);
      } catch (err) {
        console.error(`Error deleting original file ${fileName}:`, err);
      }
    }
    
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
}

// Process a single directory
async function processDirectory(dirName) {
  const sourceDir = path.join(basePhotosDir, dirName);
  const destDir = path.join(sourceDir, 'jpg');
  
  console.log(`\n=== Processing directory: ${dirName} ===`);
  
  // Skip if source directory doesn't exist
  if (!fs.existsSync(sourceDir)) {
    console.log(`Directory does not exist: ${sourceDir}`);
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
    
    // Filter for supported file types
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      // Skip directories and files in the jpg subdirectory
      if (file === 'jpg' || fs.statSync(path.join(sourceDir, file)).isDirectory()) {
        return false;
      }
      return supportedExtensions.includes(ext.toLowerCase());
    });
    
    if (mediaFiles.length === 0) {
      console.log(`No supported media files found in ${dirName}`);
      return;
    }
    
    console.log(`Found ${mediaFiles.length} files to convert in ${dirName}`);
    
    // Process all files
    const promises = mediaFiles.map(file => {
      const filePath = path.join(sourceDir, file);
      return processFile(filePath, file, destDir);
    });
    
    await Promise.all(promises);
    
    console.log(`Completed conversion in directory: ${dirName}`);
  } catch (error) {
    console.error(`Error processing directory ${dirName}:`, error);
  }
}

// Main function to convert all media
async function convertAllMedia() {
  try {
    console.log('Starting media conversion across all directories...');
    
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
    
    console.log('\nAll media conversion complete!');
  } catch (error) {
    console.error('Error in media conversion process:', error);
  }
}

// Run the conversion
convertAllMedia(); 