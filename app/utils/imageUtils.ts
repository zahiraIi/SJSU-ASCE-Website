// Constants
const USE_LOCAL_IMAGES = process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES === 'true';
const GOOGLE_DRIVE_ENABLED = process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED === 'true';
const FALLBACK_IMAGE = process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL || '/images/fallback.jpg';

// Google Drive folder ID - use the direct folder ID instead of extracting it
const DRIVE_FOLDER_ID = '1ZoOUdRl8411fSqKUbZPCG6Z1n0hSUbNK';

// Common image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Function to extract file ID from Google Drive URL
export function extractGoogleDriveFileId(url: string): string {
  if (!url) return '';
  
  let fileId = '';
  
  try {
    // Handle different Google Drive URL formats
    if (url.includes('/file/d/')) {
      // Format: https://drive.google.com/file/d/{fileId}/view
      fileId = url.split('/file/d/')[1].split('/')[0];
    } else if (url.includes('?id=')) {
      // Format: https://drive.google.com/open?id={fileId}
      fileId = url.split('?id=')[1].split('&')[0];
    } else if (url.includes('/folders/')) {
      // Format: https://drive.google.com/drive/folders/{folderId}
      fileId = url.split('/folders/')[1].split('?')[0].split('/')[0];
    } else if (url.includes('drive.google.com/uc?')) {
      // Already in export format, extract the id parameter
      const urlObj = new URL(url);
      fileId = urlObj.searchParams.get('id') || '';
    }
    
    // Return the cleaned file ID
    return fileId.trim();
  } catch (err) {
    console.error('Error extracting Google Drive file ID:', err);
    return '';
  }
}

// Function to convert Google Drive URL to direct image URL
export function getGoogleDriveImageUrl(driveUrl: string): string {
  // If it's already in the export format, return as is
  if (driveUrl.includes('drive.google.com/uc?')) {
    return driveUrl;
  }
  
  try {
    const fileId = extractGoogleDriveFileId(driveUrl);
    if (!fileId) {
      console.warn(`Could not extract file ID from Google Drive URL: ${driveUrl}`);
      return FALLBACK_IMAGE;
    }
    
    // Using the thumbnail format (more reliable)
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  } catch (err) {
    console.error('Error creating Google Drive image URL:', err);
    return FALLBACK_IMAGE;
  }
}

// Function to get direct file URL from Google Drive with file ID
export function getDirectFileUrl(fileId: string): string {
  if (!fileId) return FALLBACK_IMAGE;
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

// Hardcoded mapping of local paths to Google Drive file IDs
// This is a workaround since we can't programmatically search a Google Drive folder
// without using the Drive API with proper authentication
const PATH_TO_ID_MAP: Record<string, string> = {
  // ASCE Logo
  '/images/ASCELOGO/ASCE.png': '1FeWhGvPTGHZGS4ExIQhYl-hPebGWQGHQ',
  
  // Photos
  '/images/Photos/FGM Pics/DSC00698.JPG': '1pYkgQnT5wdVkYH-asdqCZCn_7yO-AiHt',
  '/images/Photos/FGM Pics/DSC00700.JPG': '1RBpVlmvA_gCrw8jTf9RXX0WbQrpDi1hO',
  '/images/Photos/FGM Pics/possiblefrontpage.JPG': '1vQz8wuJ4JnDdXfm2bPDXpY88tgpLcgf5',
  '/images/Photos/FGM Pics/generalmeeting.JPG': '1sMqpKy4Hy0fdrR5FJeXB2W1zV4SxrpIW',
  
  // L&L
  '/images/Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg': '1T8Wuj5p2KQz-6A4oIQ5nZB9jP9cJg_Vd',
  '/images/Photos/L&L/jpg/IMG_1424.jpg': '1yX6fF8hHe_yJQqhJtR2BV-Q_LO8Ixxp_',
  
  // Tabling
  '/images/Photos/Tabling/ascetabling.jpg': '1zKrUJDtyq-QFgCEfXTqBYXNs8DV40jzX',
  '/images/Photos/Tabling/ascetabling2.jpg': '1dLrQPLcY6j8b2Bm7E_k0r7Y3c9eumMoZ',
  
  // Fallback image (used if path not found)
  '/images/fallback.jpg': '1qXzA8nL-EDR_7qX6MZ1fywVLSxPTVZci'
};

// Function to get image URL based on environment and settings
export function getImageUrl(path: string): string {
  // Handle empty paths
  if (!path) return FALLBACK_IMAGE;
  
  try {
    // If it's already a full URL (e.g., Google Drive URL)
    if (path.startsWith('http')) {
      // If it's already a Google Drive URL, convert it to a direct URL
      if (path.includes('drive.google.com')) {
        return getGoogleDriveImageUrl(path);
      }
      // Otherwise return as is
      return path;
    }
    
    // If Google Drive is enabled
    if (GOOGLE_DRIVE_ENABLED) {
      // Try to find a matching file ID in our map
      const fileId = PATH_TO_ID_MAP[path];
      if (fileId) {
        // Return a direct thumbnail URL using the file ID
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
      }
      
      // If no direct mapping found, try to find a partial match
      const filename = path.split('/').pop()?.toLowerCase() || '';
      const partialMatches = Object.entries(PATH_TO_ID_MAP).filter(([key]) => 
        key.toLowerCase().includes(filename)
      );
      
      if (partialMatches.length > 0) {
        // Use the first partial match
        return `https://drive.google.com/thumbnail?id=${partialMatches[0][1]}&sz=w1000`;
      }
      
      // Log missing mappings to help developers update the map
      console.warn(`No Google Drive mapping found for: ${path}`);
      
      // Return fallback
      return FALLBACK_IMAGE;
    }
    
    // If we're using local images, and we're in development
    if (USE_LOCAL_IMAGES) {
      // Just return the local path - but it probably doesn't exist
      return path;
    }
  } catch (err) {
    console.error('Error in getImageUrl:', err);
  }
  
  // Fallback to the fallback image
  return FALLBACK_IMAGE;
}

// Function to handle image loading errors
export function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = event.target as HTMLImageElement;
  console.error(`Image failed to load: ${img.src}`);
  if (img.src !== FALLBACK_IMAGE) {
    console.log('Replacing with fallback image:', FALLBACK_IMAGE);
    img.src = FALLBACK_IMAGE;
  }
} 