import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

// Cloudflare R2 configuration
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'sjsuascewebsite';

// Create R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

export async function GET(request: NextRequest) {
  try {
    // Check configuration
    const configInfo = {
      accountId: R2_ACCOUNT_ID ? "Set" : "Missing",
      accessKeyId: R2_ACCESS_KEY_ID ? "Set" : "Missing",
      secretAccessKey: R2_SECRET_ACCESS_KEY ? "Set" : "Missing",
      bucketName: R2_BUCKET_NAME,
      useR2Storage: process.env.NEXT_PUBLIC_USE_R2_STORAGE,
      useSignedUrls: process.env.NEXT_PUBLIC_USE_R2_SIGNED_URLS,
      publicDomain: process.env.R2_PUBLIC_DOMAIN || "Not Set",
      r2PublicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "Not Set",
      nodeEnv: process.env.NODE_ENV || "Not Set",
      vercelUrl: process.env.VERCEL_URL || "Not Set",
      host: request.headers.get('host') || "Not Available",
      referer: request.headers.get('referer') || "Not Available"
    };
    
    // Try to list objects
    let listingResults = [];
    try {
      const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        MaxKeys: 5,
      });
      
      const response = await r2Client.send(command);
      listingResults = response.Contents?.map(obj => ({
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified
      })) || [];
    } catch (listError: any) {
      return NextResponse.json({
        success: false,
        config: configInfo,
        error: `Failed to list objects: ${listError.message}`,
        stack: listError.stack
      }, { status: 500 });
    }
    
    // Try to get a specific test object
    let testObjectResult: {
      success: boolean;
      key?: string;
      contentType?: string;
      size?: number;
      etag?: string;
      publicUrl?: string;
      publicUrlStatus?: string;
      error?: string;
    } | null = null;
    
    if (listingResults.length > 0) {
      try {
        const testKey = listingResults[0].key;
        
        // Get test object
        const getCommand = new GetObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: testKey,
        });
        
        const getResponse = await r2Client.send(getCommand);
        testObjectResult = {
          success: true,
          key: testKey,
          contentType: getResponse.ContentType,
          size: getResponse.ContentLength,
          etag: getResponse.ETag
        };
        
        // Generate public URL for test object
        const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL 
          ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, '')}/${testKey}`
          : null;
            
        if (publicUrl) {
          testObjectResult.publicUrl = publicUrl;
          
          // Test public URL accessibility
          try {
            const urlCheckResponse = await fetch(publicUrl, { method: 'HEAD' });
            testObjectResult.publicUrlStatus = urlCheckResponse.ok ? 'Accessible' : `Error: ${urlCheckResponse.status}`;
          } catch (urlError: any) {
            testObjectResult.publicUrlStatus = `Error checking URL: ${urlError.message}`;
          }
        }
      } catch (getError: any) {
        testObjectResult = {
          success: false,
          error: `Failed to get test object: ${getError.message}`
        };
      }
    }
    
    // Function to generate URLs for each test object
    const objectsWithUrls = listingResults.map(obj => {
      const key = obj.key as string;
      const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL 
        ? `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL.replace(/\/$/, '')}/${key}`
        : null;
      
      return {
        ...obj,
        publicUrl,
        apiUrl: `/api/r2image?path=${encodeURIComponent(key)}`
      };
    });
    
    // Return success response with all data
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      config: configInfo,
      objects: objectsWithUrls,
      testObject: testObjectResult,
    }, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Unexpected error: ${error.message}`,
      stack: error.stack
    }, { status: 500 });
  }
} 