# SJSU ASCE Website Image Processing Scripts

This directory contains scripts for processing and optimizing images for the SJSU ASCE website.

## Available Scripts

### 1. `process-photos.js` (Recommended)

Run the entire image processing workflow in a single command:

```bash
npm run process-photos
```

This script:
1. Converts all HEIC and other unsupported formats to JPG
2. Deletes the original HEIC files after conversion
3. Optimizes all images in-place for web display
4. Creates backups of original files in the `../backup/images` directory

### 2. `watch-photos.js` (Auto-Processing)

Watch the photos directory and automatically process new/changed images:

```bash
npm run watch-photos
```

This script:
1. Monitors the photos directory for new or changed files
2. Automatically converts and optimizes new images as they're added
3. Runs continuously in the background (stop with Ctrl+C)

## Additional Scripts

### `convert-all-media.js`

Converts HEIC, PNG, and WebP files across all Photo directories to JPG format:

```bash
node scripts/convert-all-media.js
```

- Scans all subdirectories in `public/images/Photos/`
- Converts HEIC, PNG, and WebP files to JPG format
- Deletes original HEIC files after conversion

### `optimize-photos.js`

Optimizes all images in-place:

```bash
node scripts/optimize-photos.js
```

- Processes all images recursively in Photos directory
- Creates backups of original files
- Replaces originals with optimized versions
- Moves files from jpg subdirectories up to parent directory
- Removes empty jpg subdirectories when possible

## Legacy Scripts

These scripts are kept for backwards compatibility but are no longer recommended:

### `convert-media.js`

Older script for converting HEIC files in specific folders.

### `optimize-images.js`

Original script for optimizing officer photos.

### `optimize-all-images.js`

Previous script that created separate directories for optimized images.

### `process-all-images.js`

Previous combined script (prefer the new `process-photos.js` instead).

## Workflow

The recommended workflow for processing new images is:

1. Place new images in the appropriate subdirectory under `public/images/Photos/`
2. Run `npm run process-photos` to convert and optimize all images in one step
3. Or, keep `npm run watch-photos` running to automatically process new images as they're added

## File Structure

```
public/images/
├── Photos/                   # All photos are processed in-place
│   ├── L&L/                  # Example directory
│   │   ├── image1.jpg        # Optimized JPG file
│   │   ├── image2.jpg        # Optimized JPG file
│   └── [other directories]/
└── officers/                 # Special case for officer photos
```

## Backups

Original files are backed up to:

```
backup/images/
└── [directory structure matching Photos/]
```

You can safely delete the backup directory if you don't need to keep the original high-res files. 