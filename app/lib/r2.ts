import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'asce-images';

// Log configuration for debugging (without showing secrets)
console.log('R2 Configuration:');
console.log('- Account ID:', R2_ACCOUNT_ID ? 'Set' : 'Missing');
console.log('- Access Key ID:', R2_ACCESS_KEY_ID ? 'Set' : 'Missing');
console.log('- Secret Access Key:', R2_SECRET_ACCESS_KEY ? 'Set' : 'Missing');
console.log('- Bucket Name:', R2_BUCKET_NAME);

// Create R2 client (which uses the S3 API)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// Cache for signed URLs to avoid generating new ones frequently
const urlCache = new Map<string, { url: string; expires: number }>();
const URL_EXPIRY = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Get a signed URL for an object in Cloudflare R2
 */
export async function getSignedR2Url(key: string): Promise<string> {
  try {
    // Check if we have the necessary configuration
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      console.error('Missing R2 configuration. Please check your environment variables.');
      throw new Error('Missing R2 configuration');
    }

    // Check cache first
    const now = Date.now();
    const cached = urlCache.get(key);
    if (cached && now < cached.expires) {
      return cached.url;
    }

    // Create a command to get the object
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    console.log(`Generating signed URL for: ${key}`);

    // Generate a signed URL (valid for 6 hours)
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 21600 });
    
    // Cache the URL
    urlCache.set(key, { url: signedUrl, expires: now + URL_EXPIRY });
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed R2 URL:', error);
    throw error;
  }
}

/**
 * Get a public URL for an object in Cloudflare R2 (if available via Public Access)
 */
export function getPublicR2Url(key: string): string {
  // For local development, use the Wrangler worker
  if (process.env.NODE_ENV === 'development') {
    // Default Wrangler worker runs on port 8787
    const url = `http://localhost:8787/${encodeURIComponent(key)}`;
    console.log(`Using local Wrangler worker URL: ${url}`);
    return url;
  }
  
  // If you have a Cloudflare R2 public bucket with custom domain
  const publicDomain = process.env.R2_PUBLIC_DOMAIN;
  if (publicDomain) {
    const url = `https://${publicDomain}/${key}`;
    console.log(`Generated public URL with custom domain: ${url}`);
    return url;
  }
  
  // Use the exact public R2.dev URL from the Cloudflare dashboard for production
  const url = `https://pub-a786dffe79f45f1ad652f22091f210.r2.dev/${key}`;
  console.log(`Generated public URL: ${url}`);
  return url;
}

/**
 * List objects in a directory in Cloudflare R2
 */
export async function listR2Objects(prefix: string = ''): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: 1000,
    });
    
    const response = await r2Client.send(command);
    
    // Extract keys from objects and return
    return (response.Contents || [])
      .map(obj => obj.Key!)
      .filter(key => key !== undefined);
  } catch (error) {
    console.error('Error listing R2 objects:', error);
    return [];
  }
}

export { r2Client }; 