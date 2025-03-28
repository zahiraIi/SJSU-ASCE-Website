const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Base photos directory
const basePhotosDir = path.join(__dirname, '../public/images/Photos');

// Backup directory for original files
const backupDir = path.join(__dirname, '../backup/images');

// Create backup directory if it doesn't exist
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Check if file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
}

// Function to optimize and replace a single image
async function optimizeImage(filePath, fileName, dirPath) {
  try {
    const ext = path.extname(fileName).toLowerCase();
    const baseName = path.parse(fileName).name;
    const fileStats = fs.statSync(filePath);
    const fileModified = fileStats.mtimeMs;
    
    // Always create JPG format
    const jpgOutputPath = path.join(dirPath, `${baseName}.jpg`);
    
    // Skip if file is already optimized
    // We'll use file size as an indicator - if under 300KB, likely already optimized
    if (fileStats.size < 300 * 1024 && ext === '.jpg') {
      console.log(`Skipping ${fileName} - appears to be already optimized`);
      return;
    }
    
    console.log(`Optimizing: ${fileName}`);
    
    // Create a backup of the original file
    const relativePath = path.relative(basePhotosDir, dirPath);
    const backupFilePath = path.join(backupDir, relativePath);
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupFilePath)) {
      fs.mkdirSync(backupFilePath, { recursive: true });
    }
    
    // Copy original to backup
    const backupFile = path.join(backupFilePath, fileName);
    if (!fs.existsSync(backupFile)) {
      fs.copyFileSync(filePath, backupFile);
      console.log(`Backed up original to: ${backupFile}`);
    }
    
    // Read the image
    const inputBuffer = await fs.promises.readFile(filePath);
    
    // Create an optimized JPEG version
    const outputBuffer = await sharp(inputBuffer)
      .resize({
        width: 1200,       // Reasonable width for web display
        height: 900,       // Reasonable height
        fit: 'inside',     // Keep aspect ratio
        withoutEnlargement: true // Don't enlarge small images
      })
      .jpeg({ quality: 85, progressive: true })
      .toBuffer();
    
    // Replace the original file with optimized version
    await fs.promises.writeFile(jpgOutputPath, outputBuffer);
    
    // If the original wasn't a JPG, remove it
    if (filePath !== jpgOutputPath) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Error removing original file: ${filePath}`, err);
      }
    }
    
    console.log(`Optimized: ${fileName} → ${baseName}.jpg`);
  } catch (error) {
    console.error(`Error optimizing ${fileName}:`, error);
  }
}

// Process a single directory
async function processDirectory(dirPath) {
  const relativePath = path.relative(basePhotosDir, dirPath);
  console.log(`\n=== Processing directory: ${relativePath || 'root'} ===`);
  
  try {
    // Read all files in the directory
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    
    // Process all subdirectories first (recursively)
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'jpg') {
        const subdirPath = path.join(dirPath, entry.name);
        await processDirectory(subdirPath);
      }
    }
    
    // Process image files in current directory
    const imageFiles = entries.filter(entry => 
      !entry.isDirectory() && isImageFile(entry.name)
    );
    
    if (imageFiles.length === 0) {
      console.log(`No image files found in ${relativePath || 'root'}`);
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize in ${relativePath || 'root'}`);
    
    // Check for jpg directory
    const jpgDirPath = path.join(dirPath, 'jpg');
    if (fs.existsSync(jpgDirPath)) {
      // Process JPG files from the jpg directory
      const jpgEntries = await fs.promises.readdir(jpgDirPath, { withFileTypes: true });
      const jpgFiles = jpgEntries.filter(entry => 
        !entry.isDirectory() && isImageFile(entry.name)
      );
      
      if (jpgFiles.length > 0) {
        console.log(`Found ${jpgFiles.length} images in jpg subdirectory to move up and optimize`);
        
        // Process and move files up from jpg subdirectory
        for (const file of jpgFiles) {
          const filePath = path.join(jpgDirPath, file.name);
          await optimizeImage(filePath, file.name, dirPath);
        }
        
        // After all files are processed, try to remove the jpg directory if empty
        try {
          const remainingFiles = await fs.promises.readdir(jpgDirPath);
          if (remainingFiles.length === 0) {
            fs.rmdirSync(jpgDirPath);
            console.log(`Removed empty jpg directory: ${relativePath}/jpg`);
          } else {
            console.log(`Note: jpg directory not removed as it still contains ${remainingFiles.length} files`);
          }
        } catch (err) {
          console.error(`Error removing jpg directory: ${jpgDirPath}`, err);
        }
      }
    }
    
    // Process current directory's image files
    for (const file of imageFiles) {
      const filePath = path.join(dirPath, file.name);
      await optimizeImage(filePath, file.name, dirPath);
    }
    
    console.log(`Completed optimization in directory: ${relativePath || 'root'}`);
  } catch (error) {
    console.error(`Error processing directory ${relativePath}:`, error);
  }
}

// Main function to optimize all images
async function optimizeAllImages() {
  try {
    console.log('Starting in-place image optimization across all directories...');
    
    // Process the photos directory 
    await processDirectory(basePhotosDir);
    
    console.log('\nAll image optimization complete!');
  } catch (error) {
    console.error('Error in image optimization process:', error);
  }
}

// Run the optimization
optimizeAllImages(); 