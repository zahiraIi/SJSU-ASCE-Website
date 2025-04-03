/**
 * Utility functions for loading images from Cloudflare R2 Storage
 */
import { getSignedR2Url, getPublicR2Url } from '../lib/r2';

// Default fallback image
const FALLBACK_IMAGE = '/images/fallback.jpg';

// Whether to use Cloudflare R2 for image storage
const USE_R2_STORAGE = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

// Whether to use signed URLs (private bucket) or public URLs
const USE_SIGNED_URLS = process.env.NEXT_PUBLIC_USE_R2_SIGNED_URLS === 'true';

/**
 * Normalizes a path for comparison.
 * - Converts to lowercase
 * - Decodes URI components
 * - Trims whitespace
 * - Removes leading/trailing slashes
 * - Removes common leading prefixes like '/images/' or '/images/Photos/'.
 */
function normalizePath(path: string, isLocal: boolean = false): string {
  let normalized = decodeURIComponent(path).toLowerCase().trim();
  if (isLocal) {
    if (normalized.startsWith('/images/photos/')) { // Check for '/images/Photos/' first
      normalized = normalized.substring(15); 
    } else if (normalized.startsWith('/images/')) { // Then check for '/images/'
      normalized = normalized.substring(7); 
    }
  }
  // Remove any remaining leading/trailing slashes
  if (normalized.startsWith('/')) {
    normalized = normalized.substring(1);
  }
  if (normalized.endsWith('/')) {
    normalized = normalized.substring(0, normalized.length - 1);
  }
  return normalized;
}

/**
 * Finds the best matching R2 object key for a requested local path.
 * Prioritizes exact path matches, then filename matches, using directory hints for tie-breaking.
 *
 * @param localPath The requested local path (e.g., '/images/FGM Pics/possiblefrontpage.JPG')
 * @param r2FileList The list of actual keys in the R2 bucket (e.g., ['FGM Pics/possiblefrontpage.JPG', ...])
 * @returns The best matching R2 key or null.
 */
export function findR2KeyForLocalPath(localPath: string, r2FileList: string[]): string | null {
  if (!localPath || !r2FileList || r2FileList.length === 0) {
    return null;
  }

  const normalizedLocalPath = normalizePath(localPath, true); // Indicate it's a local path
  if (!normalizedLocalPath) return null;

  const normalizedR2Files = r2FileList.map(key => ({
    original: key,
    normalized: normalizePath(key, false) // Normalize R2 keys
  }));

  // 1. Try exact match on normalized paths
  const exactMatch = normalizedR2Files.find(file => file.normalized === normalizedLocalPath);
  if (exactMatch) {
    // console.log(`Exact match found for ${localPath}: ${exactMatch.original}`);
    return exactMatch.original;
  }

  // 2. If no exact match, try matching by filename and directory hints
  const localPathSegments = normalizedLocalPath.split('/');
  const filename = localPathSegments.pop(); // Get the filename part
  if (!filename) return null; // Should not happen if normalizedLocalPath is valid

  // Find all R2 keys ending with the same filename
  const potentialMatches = normalizedR2Files.filter(file => file.normalized.endsWith('/' + filename) || file.normalized === filename);

  if (potentialMatches.length === 0) {
     // console.warn(`No R2 key found ending with filename: ${filename} (from local path ${localPath})`);
    return null;
  }

  if (potentialMatches.length === 1) {
    // console.log(`Single filename match found for ${localPath}: ${potentialMatches[0].original}`);
    return potentialMatches[0].original; // Only one candidate, return it
  }

  // 3. Tie-breaking (potentialMatches.length > 1)
  // console.warn(`Multiple potential matches for filename ${filename} (from local path ${localPath}). Attempting tie-break.`);

  const localParentPath = localPathSegments.join('/'); // e.g., "fgm pics"

  // Initialize bestMatch with the first candidate and calculate its initial score
  let bestMatch = potentialMatches[0];
  let highestScore = -1;

  const initialMatchSegments = bestMatch.normalized.split('/');
  initialMatchSegments.pop(); // Remove filename
  const initialMatchParentPath = initialMatchSegments.join('/');
  if (localParentPath && initialMatchParentPath.endsWith(localParentPath)) {
      highestScore = localParentPath.length; // Score based on matching parent path length
  }

  // Iterate through the rest of the potential matches (starting from the second one)
  for (let i = 1; i < potentialMatches.length; i++) {
      const currentMatch = potentialMatches[i];
      const matchSegments = currentMatch.normalized.split('/');
      matchSegments.pop(); // Remove filename
      const matchParentPath = matchSegments.join('/');

      let currentScore = -1; // Default score if no parent match
      if (localParentPath && matchParentPath.endsWith(localParentPath)) {
          currentScore = localParentPath.length;
      }

      // console.log(`  - Candidate: ${currentMatch.original}, Parent: ${matchParentPath}, Score: ${currentScore}`);

      if (currentScore > highestScore) {
          highestScore = currentScore;
          bestMatch = currentMatch;
      }
      // Optional: Add more sophisticated scoring tie-breakers here if needed
      // (e.g., if scores are equal, prefer shorter overall path?)
  }

  // console.log(`Tie-break winner for ${localPath}: ${bestMatch.original} (Score: ${highestScore})`);
  return bestMatch.original; // Return the best one found (could still be the first one)
}

/**
 * Get a URL for an image from Cloudflare R2
 */
export async function getR2ImageUrl(r2Key: string): Promise<string> {
  if (!r2Key) return FALLBACK_IMAGE;

  // console.log('getR2ImageUrl - R2 Key:', r2Key);
  // console.log('getR2ImageUrl - USE_SIGNED_URLS:', USE_SIGNED_URLS);

  try {
    // If it's already a full URL, return as is (shouldn't happen with r2Key, but safe check)
    if (r2Key.startsWith('http')) {
      console.warn('getR2ImageUrl called with full URL:', r2Key);
      return r2Key;
    }

    // Get the appropriate URL from R2 based on configuration
    let url: string;
    if (USE_SIGNED_URLS) {
      // Use the API route which handles authentication server-side
      url = `/api/r2image?path=${encodeURIComponent(r2Key)}`;
      // console.log('getR2ImageUrl - Using API route:', url);
    } else {
      // Get a public URL (for public buckets)
      url = getPublicR2Url(r2Key);
      // console.log('getR2ImageUrl - Using Public URL:', url);
    }

    // console.log('getR2ImageUrl - Got R2 URL:', url);
    return url;
  } catch (error) {
    console.error(`Error getting R2 image URL for key ${r2Key}:`, error);
    return FALLBACK_IMAGE;
  }
}

/**
 * Get an image URL, attempting to load from R2 Storage first if enabled.
 * Requires the list of files currently in the R2 bucket.
 *
 * @param requestedPath The desired path, often a local path like '/images/logo.png'
 * @param r2FileList The list of actual file keys in the R2 bucket. Pass null if R2 is disabled or list is unavailable.
 * @returns A promise resolving to the best available image URL (R2 or original path).
 */
export async function loadImage(requestedPath: string, r2FileList: string[] | null): Promise<string> {
  if (!requestedPath) return FALLBACK_IMAGE;

  // console.log('loadImage - Requested path:', requestedPath);

  try {
    // If it's already a full URL, return as is
    if (requestedPath.startsWith('http')) {
      // console.log('loadImage - Using existing URL:', requestedPath);
      return requestedPath;
    }

    // If R2 storage is enabled and we have a file list
    if (USE_R2_STORAGE && r2FileList) {
      // Try to find an R2 key matching the requested local path's filename
      const r2Key = findR2KeyForLocalPath(requestedPath, r2FileList); // Calls the updated function

      if (r2Key) {
        // console.log('loadImage - Found R2 key:', r2Key, 'for requested path:', requestedPath);
        try {
          const url = await getR2ImageUrl(r2Key);
          // console.log('loadImage - Using R2 URL:', url);
          return url;
        } catch (error) {
          console.error(`Error fetching R2 URL for key ${r2Key}, falling back to original path:`, error);
          // Fall through to return original path on error
        }
      } else {
        // console.warn(`loadImage - No R2 key found for requested path: ${requestedPath}`);
      }
    } else if (USE_R2_STORAGE && !r2FileList) {
       console.warn(`loadImage - R2 storage enabled but file list not provided for path: ${requestedPath}. Cannot search R2.`);
    }

    // If R2 is disabled, file list wasn't provided, no R2 key found, or R2 fetch failed, return the original path
    // console.log('loadImage - Falling back to original path:', requestedPath);
    return requestedPath;

  } catch (err) {
    console.error(`Error loading image for path ${requestedPath}:`, err);
    return FALLBACK_IMAGE;
  }
} 