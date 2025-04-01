# Google Drive Image Integration

This guide explains how the website uses Google Drive to serve images while maintaining local file paths in the codebase.

## Overview

Instead of storing images in the Git repository, this website uses Google Drive as an image hosting solution. This approach:

1. Keeps the Git repository small and fast
2. Allows for easy image updates without code changes
3. Maintains the original file path structure in components

## How It Works

The system uses a mapping between local file paths and Google Drive file IDs. When a component references an image at `/images/example.jpg`, the website:

1. Looks up the corresponding Google Drive file ID
2. Generates a direct thumbnail or download URL
3. Serves the image from Google Drive

### The Mapping System

The mapping is defined in `app/utils/imageUtils.ts` in the `PATH_TO_ID_MAP` object:

```typescript
const PATH_TO_ID_MAP: Record<string, string> = {
  '/images/ASCELOGO/ASCE.png': '1FeWhGvPTGHZGS4ExIQhYl-hPebGWQGHQ',
  '/images/Photos/Tabling/ascetabling.jpg': '1zKrUJDtyq-QFgCEfXTqBYXNs8DV40jzX',
  // ... more mappings
};
```

## Setup Instructions

1. Upload your images to Google Drive
2. Make sure the folder is shared with "Anyone with the link can view"
3. Set `NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED=true` in your `.env.local` file
4. Add the Google Drive folder URL to `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_DRIVE_URL="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"
   ```

## Adding New Images

When adding new images:

1. Upload the image to the Google Drive folder
2. Get the file ID from the URL (the long alphanumeric string)
3. Add a new entry to `PATH_TO_ID_MAP` in `app/utils/imageUtils.ts`:
   ```typescript
   '/images/path/to/your/image.jpg': 'YOUR_GOOGLE_DRIVE_FILE_ID'
   ```

### Getting the File ID

1. Open the image in Google Drive
2. The URL will be: `https://drive.google.com/file/d/YOUR_FILE_ID/view`
3. Copy the `YOUR_FILE_ID` portion

## Image Component Usage

Use the `OptimizedImage` component for best results:

```jsx
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage
  src="/images/path/to/your/image.jpg"
  alt="Description of image"
  width={800}
  height={600}
/>
```

## Troubleshooting

If images aren't loading:

1. Check the Google Drive sharing settings (must be "Anyone with the link")
2. Verify the file ID is correct
3. Make sure `NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED=true` in `.env.local`
4. Check the browser console for errors
5. Use the `/image-test` page to debug specific images

## Image URL Formats

The system supports different Google Drive URL formats:

- Direct file: `https://drive.google.com/file/d/FILE_ID/view`
- Open link: `https://drive.google.com/open?id=FILE_ID`
- Folder: `https://drive.google.com/drive/folders/FOLDER_ID`

## Performance Considerations

- Google Drive has bandwidth limitations for frequently accessed files
- For high-traffic sites, consider a dedicated image hosting solution
- The system uses the thumbnail API for better performance
- Images are cached in the browser

## Testing

Visit the `/image-test` page to test the image system with different file paths and Google Drive URLs.

## Related Environment Variables

```
# Enable Google Drive images
NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED=true

# The shared folder with all website images
NEXT_PUBLIC_GOOGLE_DRIVE_URL="https://drive.google.com/drive/folders/YOUR_FOLDER_ID"

# Fallback image to use when an image can't be loaded
NEXT_PUBLIC_FALLBACK_IMAGE_URL="/images/fallback.jpg"

# Whether to use local images (development only)
NEXT_PUBLIC_USE_LOCAL_IMAGES=false 