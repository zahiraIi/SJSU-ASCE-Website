import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Default fallback image
const FALLBACK_IMAGE = '/images/fallback.jpg';

// Function to get S3Client instance (reads env vars on demand)
function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  // ** Crucial Check: Are variables available when the client is needed? **
  if (!accountId || !accessKeyId || !secretAccessKey) {
      console.error('RUNTIME ERROR: Missing R2 Credentials inside getR2Client. Check .env.local and ensure server fully restarted after changes.');
      console.error(`RUNTIME Values: ID=${accountId ? 'Set' : 'Missing'}, Key=${accessKeyId ? 'Set' : 'Missing'}, Secret=${secretAccessKey ? 'Set' : 'Missing'}`);
      // Throwing an error here might be better to prevent silent failures
      // throw new Error('Missing R2 credentials required for S3Client'); 
  }

  const r2Endpoint = accountId
    ? `https://${accountId}.r2.cloudflarestorage.com`
    : undefined;

  // If endpoint is undefined due to missing accountId, S3Client might throw an error later
  if (!r2Endpoint) {
     console.error('RUNTIME ERROR: R2 endpoint is undefined, likely due to missing R2_ACCOUNT_ID.');
  }

  return new S3Client({
    region: 'auto',
    endpoint: r2Endpoint, // Pass undefined if accountId was missing
    credentials: {
      accessKeyId: accessKeyId || '', // SDK might handle missing credentials, but operations will fail
      secretAccessKey: secretAccessKey || '',
    },
  });
}

// Cache for signed URLs to avoid generating new ones frequently
const urlCache = new Map<string, { url: string; expires: number }>();
const URL_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Get a signed URL for an object in Cloudflare R2
 */
export async function getSignedR2Url(key: string): Promise<string> {
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'asce-images'; // Read here
  // Relying on getR2Client to check core credentials

  if (!R2_BUCKET_NAME) {
    console.error('RUNTIME ERROR: Missing R2_BUCKET_NAME in getSignedR2Url.');
    throw new Error('Missing R2 bucket name configuration');
  }

  try {
    // Check cache first
    const now = Date.now();
    const cached = urlCache.get(key);
    if (cached && now < cached.expires) {
      return cached.url;
    }

    const r2Client = getR2Client(); // Get client instance (checks creds inside)

    // Create a command to get the object
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    console.log(`Attempting to generate signed URL for key: ${key} in bucket: ${R2_BUCKET_NAME}`);

    // Generate a signed URL (valid for 6 hours)
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 21600 });

    // Cache the URL
    urlCache.set(key, { url: signedUrl, expires: now + URL_EXPIRY });

    return signedUrl;
  } catch (error) {
    console.error(`Error generating signed R2 URL for key ${key}:`, error);
    // Add more context if it's a credential error
    if (error instanceof Error && (error.message.includes('Missing credentials') || error.message.includes('InvalidAccessKeyId'))) {
       console.error('Signed URL generation failed likely due to missing/invalid R2 credentials at runtime.');
    }
    throw error;
  }
}

/**
 * Get a public URL for an object in Cloudflare R2 (if available via Public Access)
 */
export function getPublicR2Url(key: string): string {
  // For local development, use the public URL defined in environment variables
  if (process.env.NODE_ENV === 'development') {
    const devPublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!devPublicUrl) {
      console.warn('NEXT_PUBLIC_R2_PUBLIC_URL environment variable is not set for development. Falling back to potentially incorrect URL or path.');
      return `/r2-fallback/${key}`;
    }
    const url = `${devPublicUrl.replace(/\/$/, '')}/${key}`;
    // console.log(`Using configured public R2 URL for development: ${url}`);
    return url;
  }

  // If you have a Cloudflare R2 public bucket with custom domain
  const publicDomain = process.env.R2_PUBLIC_DOMAIN; // Read here
  if (publicDomain) {
    const url = `https://${publicDomain}/${key}`;
    // console.log(`Generated public URL with custom domain: ${url}`);
    return url;
  }

  // Use the exact public R2.dev URL from the Cloudflare dashboard for production
  const prodPublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL; // Read public URL here too for consistency
   if (!prodPublicUrl) {
      console.error('PRODUCTION ERROR: NEXT_PUBLIC_R2_PUBLIC_URL environment variable is not set! Cannot generate public URLs.');
       return `/r2-fallback/${key}`; // Fallback
    }
  const url = `${prodPublicUrl.replace(/\/$/, '')}/${key}`;
  // console.log(`Generated public URL: ${url}`);
  return url;
}


/**
 * List objects in a directory in Cloudflare R2
 */
export async function listR2Objects(prefix: string = ''): Promise<string[]> {
  const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'asce-images'; // Read here

  if (!R2_BUCKET_NAME) {
    console.error('RUNTIME ERROR: Missing R2_BUCKET_NAME in listR2Objects.');
    return []; // Cannot list without bucket name
  }

  try {
    console.log(`Attempting to list R2 objects. Bucket: ${R2_BUCKET_NAME}, Prefix: '${prefix}'`);
    const r2Client = getR2Client(); // Get client instance (checks creds inside)
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 1000, // Consider pagination for more than 1000 objects
    });

    const response = await r2Client.send(command);
    console.log(`Successfully listed R2 objects. Found: ${response.Contents?.length ?? 0}`);

    // Extract keys from objects and return
    return (response.Contents || [])
      .map(obj => obj.Key!)
      .filter((key): key is string => key !== undefined);
  } catch (error) {
    console.error(`Error listing R2 objects (Bucket: ${R2_BUCKET_NAME}, Prefix: ${prefix}):`, error);
     // Check if error is due to missing credentials or endpoint (which implies missing Account ID)
     if (error instanceof Error && (error.name === 'CredentialsProviderError' || error.message.includes('credentials') || error.name === 'EndpointProviderError')) {
        console.error('Listing failed likely due to missing R2 credentials (ID/Key/Secret) at runtime. Check .env.local and ensure server was fully restarted.');
     }
    return []; // Return empty list on error
  }
}

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


// Keep loadImage as it was, it calls the findR2KeyForLocalPath above
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
  
      // Check if R2 storage is explicitly enabled
      const useR2 = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

      // If R2 storage is enabled and we have a file list
      if (useR2 && r2FileList) {
        // Try to find an R2 key matching the requested local path's filename
        const r2Key = findR2KeyForLocalPath(requestedPath, r2FileList); // Calls the updated function
  
        if (r2Key) {
           // Decide whether to use signed URLs or public URLs based on env var
           const useSigned = process.env.NEXT_PUBLIC_USE_R2_SIGNED_URLS === 'true';
           let imageUrl: string | null = null;

           try {
              if (useSigned) {
                // Use the API route for signed URLs (requires server-side auth)
                 imageUrl = `/api/r2image?path=${encodeURIComponent(r2Key)}`;
              } else {
                // Use direct public URL generation
                 imageUrl = getPublicR2Url(r2Key); // Calls the updated public URL function
              }
              // console.log('loadImage - Using R2 URL:', imageUrl);
              return imageUrl;
            } catch (error) {
              console.error(`Error generating R2 URL for key ${r2Key} (signed=${useSigned}), falling back to original path:`, error);
              // Fall through to return original path on error
            }
        } else {
          // console.warn(`loadImage - No R2 key found for requested path: ${requestedPath}`);
        }
      } else if (useR2 && !r2FileList) {
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