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
      publicDomain: process.env.R2_PUBLIC_DOMAIN || "Not Set"
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
    let testObjectResult = null;
    try {
      const testPath = 'ASCELOGO/ASCE.png'; // Path to test
      const command = new GetObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: testPath,
      });
      
      const response = await r2Client.send(command);
      testObjectResult = {
        success: true,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
      };
    } catch (objectError: any) {
      testObjectResult = {
        success: false,
        error: objectError.message
      };
    }
    
    // Return all debug info
    return NextResponse.json({
      success: true,
      config: configInfo,
      listing: listingResults,
      testObject: testObjectResult
    }, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 