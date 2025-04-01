'use client';

import React, { useState } from 'react';

export default function RawTest() {
  // Test image in Backblaze bucket
  const imageFileName = 'ASCE.png';
  const bucketName = 'ascewebsiteimages';
  
  // Different URL formats to test
  const directUrl = `https://f004.backblazeb2.com/file/${bucketName}/${imageFileName}`;
  const s3StyleUrl = `https://s3.us-west-004.backblazeb2.com/${bucketName}/${imageFileName}`;
  const downloadByNameUrl = `https://f004.backblazeb2.com/b2api/v2/b2_download_file_by_name?bucketName=${bucketName}&fileName=${imageFileName}`;
  
  // B2 API format (usually requires authentication)
  const apiUrl = `https://api.backblazeb2.com/b2api/v2/b2_download_file_by_name?bucketName=${bucketName}&fileName=${imageFileName}`;
  
  // Public bucket URL format - often works best
  const publicUrl = `https://f004.backblazeb2.com/b2/${bucketName}/${imageFileName}`;
  
  // Timestamp to prevent caching
  const timestamp = Date.now();
  
  // State for capturing status
  const [corsStatus, setCorsStatus] = useState<string>('Not tested');
  const [corsHeaders, setCorsHeaders] = useState<any>(null);

  // Function to test CORS
  const testCors = async () => {
    setCorsStatus('Testing...');
    try {
      const response = await fetch(directUrl, {
        method: 'HEAD',
        mode: 'cors'
      });
      
      // Get headers
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });
      
      setCorsHeaders(headers);
      setCorsStatus(response.ok ? 'CORS working!' : `Error: ${response.status} ${response.statusText}`);
    } catch (error) {
      setCorsStatus(`CORS Error: ${error instanceof Error ? error.message : String(error)}`);
      setCorsHeaders(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Backblaze B2 Raw URL Testing</h1>
      <p className="mb-8">
        This page tests different URL formats for accessing files in Backblaze B2 storage.
        Each image is loaded with a different URL pattern to determine which works best with your bucket settings.
      </p>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">CORS Test</h2>
        <p className="mb-4">Test if your Backblaze B2 bucket has proper CORS settings:</p>
        <button 
          onClick={testCors}
          className="px-4 py-2 bg-blue-500 text-white rounded mb-4 hover:bg-blue-600"
        >
          Test CORS Headers
        </button>
        <div className="mt-2">
          <p className="font-medium">Status: <span className={corsStatus.includes('Error') ? 'text-red-500' : corsStatus === 'CORS working!' ? 'text-green-500' : 'text-blue-500'}>{corsStatus}</span></p>
          {corsHeaders && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <h3 className="font-medium mb-1">Response Headers:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(corsHeaders, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-4 rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-2">1. Direct URL Format</h2>
          <div className="bg-gray-100 p-2 rounded mb-3 text-xs font-mono break-all">
            {directUrl}
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 border rounded overflow-hidden">
            <img 
              src={directUrl} 
              alt="Direct URL Test" 
              className="object-contain w-full"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement!.innerHTML += `
                  <div class="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
                    <div class="text-center">
                      <p class="text-red-500 font-medium">Failed to load image</p>
                      <p class="text-sm mt-2">Direct URL format doesn't work</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </div>
        
        <div className="border p-4 rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-2">2. S3-Style URL</h2>
          <div className="bg-gray-100 p-2 rounded mb-3 text-xs font-mono break-all">
            {s3StyleUrl}
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 border rounded overflow-hidden">
            <img 
              src={s3StyleUrl} 
              alt="S3-Style URL Test" 
              className="object-contain w-full"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement!.innerHTML += `
                  <div class="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
                    <div class="text-center">
                      <p class="text-red-500 font-medium">Failed to load image</p>
                      <p class="text-sm mt-2">S3-Style URL format doesn't work</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </div>
        
        <div className="border p-4 rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-2">3. Download By Name API</h2>
          <div className="bg-gray-100 p-2 rounded mb-3 text-xs font-mono break-all">
            {downloadByNameUrl}
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 border rounded overflow-hidden">
            <img 
              src={downloadByNameUrl} 
              alt="Download By Name API Test" 
              className="object-contain w-full"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement!.innerHTML += `
                  <div class="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
                    <div class="text-center">
                      <p class="text-red-500 font-medium">Failed to load image</p>
                      <p class="text-sm mt-2">Download By Name API doesn't work</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </div>
        
        <div className="border p-4 rounded-lg bg-white">
          <h2 className="text-lg font-semibold mb-2">4. Public URL Format</h2>
          <div className="bg-gray-100 p-2 rounded mb-3 text-xs font-mono break-all">
            {publicUrl}
          </div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 border rounded overflow-hidden">
            <img 
              src={publicUrl} 
              alt="Public URL Format Test" 
              className="object-contain w-full"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                target.parentElement!.innerHTML += `
                  <div class="absolute inset-0 flex items-center justify-center bg-red-50 p-4">
                    <div class="text-center">
                      <p class="text-red-500 font-medium">Failed to load image</p>
                      <p class="text-sm mt-2">Public URL format doesn't work</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-5 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-bold mb-3">Troubleshooting Steps</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">1. Check Bucket Permissions</h3>
            <p className="text-sm mt-1">Make sure your bucket is set to "Public" in the Backblaze B2 console.</p>
          </div>
          
          <div>
            <h3 className="font-medium">2. Configure CORS for Web Access</h3>
            <p className="text-sm mt-1">Add the following CORS configuration to your bucket:</p>
            <pre className="bg-gray-800 text-white p-3 rounded mt-2 text-xs overflow-auto">
{`{
  "corsRules": [
    {
      "allowedOrigins": ["*"],
      "allowedOperations": ["s3_head", "s3_get", "b2_download_file_by_id", "b2_download_file_by_name"],
      "allowedHeaders": ["*"],
      "maxAgeSeconds": 3600
    }
  ]
}`}
            </pre>
          </div>
          
          <div>
            <h3 className="font-medium">3. Try Direct Download Link</h3>
            <p className="text-sm mt-1">
              You can try downloading the file directly by clicking on this link: 
              <a href={directUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1 underline">Direct download</a>
            </p>
            <p className="text-sm mt-1">If this works but the images above don't, it's likely a CORS issue.</p>
          </div>
          
          <div>
            <h3 className="font-medium">4. Check Backblaze B2 Status</h3>
            <p className="text-sm mt-1">
              Verify the Backblaze B2 service status at 
              <a href="https://status.backblaze.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1 underline">status.backblaze.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 