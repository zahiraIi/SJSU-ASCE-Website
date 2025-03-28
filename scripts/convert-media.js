const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const heicConvert = require('heic-convert');
const { promisify } = require('util');

// Process command line arguments
const args = process.argv.slice(2);
let sourceDir, destDir;

// Check for command line arguments
if (args.length >= 2) {
  sourceDir = args[0];
  destDir = args[1];
} else {
  // Default source and destination directories
  sourceDir = path.join(__dirname, '../public/images/Photos/L&L');
  destDir = path.join(__dirname, '../public/images/Photos/L&L/jpg');
  console.log('No directories specified, using defaults:');
  console.log(`Source: ${sourceDir}`);
  console.log(`Destination: ${destDir}`);
  console.log('Usage: node convert-media.js <sourceDir> <destDir>');
}

// Ensure paths are absolute
if (!path.isAbsolute(sourceDir)) {
  sourceDir = path.join(process.cwd(), sourceDir);
}
if (!path.isAbsolute(destDir)) {
  destDir = path.join(process.cwd(), destDir);
}

// Supported file extensions for conversion
const supportedExtensions = ['.heic', '.HEIC', '.png', '.PNG', '.webp', '.WEBP'];

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created destination directory: ${destDir}`);
}

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
async function processFile(filePath, fileName) {
  try {
    // Extract just the base name without any extension
    const baseName = path.parse(fileName).name;
    const outputPath = path.join(destDir, `${baseName}.jpg`);
    
    // Skip if output file already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Skipping ${fileName} - already converted`);
      return;
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
    
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
}

// Main function to process all files
async function convertMedia() {
  try {
    // Validate source directory exists
    if (!fs.existsSync(sourceDir)) {
      console.error(`Error: Source directory does not exist: ${sourceDir}`);
      return;
    }

    console.log('Starting media conversion...');
    console.log(`Source: ${sourceDir}`);
    console.log(`Destination: ${destDir}`);
    
    // Read all files in the source directory
    const files = await fs.promises.readdir(sourceDir);
    
    // Filter for supported file types
    const mediaFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext.toLowerCase());
    });
    
    if (mediaFiles.length === 0) {
      console.log('No supported media files found to convert.');
      return;
    }
    
    console.log(`Found ${mediaFiles.length} files to convert`);
    
    // Process all files
    const promises = mediaFiles.map(file => {
      const filePath = path.join(sourceDir, file);
      return processFile(filePath, file);
    });
    
    await Promise.all(promises);
    
    console.log('Media conversion complete!');
  } catch (error) {
    console.error('Error in media conversion process:', error);
  }
}

// Run the conversion
convertMedia(); 