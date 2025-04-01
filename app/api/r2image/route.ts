import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'asce-images';

// Log configuration for debugging
console.log('R2 API Route Configuration:');
console.log('- Account ID:', R2_ACCOUNT_ID ? 'Set' : 'Missing');
console.log('- Access Key ID:', R2_ACCESS_KEY_ID ? 'Set' : 'Missing');
console.log('- Secret Access Key:', R2_SECRET_ACCESS_KEY ? 'Set' : 'Missing');
console.log('- Bucket Name:', R2_BUCKET_NAME);

// Create R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * API route to proxy image requests to Cloudflare R2
 * This ensures proper authentication and headers
 */
export async function GET(request: NextRequest) {
  try {
    // Get the path from the query params
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    
    console.log('R2 Image API - Requested path:', path);
    
    if (!path) {
      console.error('R2 Image API - Missing path parameter');
      return new NextResponse('Missing path parameter', { status: 400 });
    }
    
    // Verify R2 configuration
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
      console.error('R2 Image API - Missing R2 configuration');
      return new NextResponse('Server configuration error', { status: 500 });
    }
    
    // Create a command to get the object
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: path,
    });
    
    console.log(`R2 Image API - Fetching from bucket: ${R2_BUCKET_NAME}, key: ${path}`);
    
    // Get the object from R2
    const response = await r2Client.send(command);
    
    if (!response.Body) {
      console.error(`R2 Image API - Image not found: ${path}`);
      return new NextResponse('Image not found', { status: 404 });
    }
    
    // Get the image data
    const imageArrayBuffer = await response.Body.transformToByteArray();
    const contentType = response.ContentType || 'image/jpeg';
    
    console.log(`R2 Image API - Successfully fetched image: ${path}, content-type: ${contentType}`);
    
    // Return the image with proper content type
    return new NextResponse(imageArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      }
    });
  } catch (error: any) {
    console.error('Error in R2 image API:', error);
    return new NextResponse(`Error fetching image: ${error.message}`, { status: 500 });
  }
} 