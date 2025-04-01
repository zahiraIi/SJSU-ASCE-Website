'use client';

import React from 'react';

export default function R2DirectTestPage() {
  // Direct URLs to specific images in the R2 bucket
  const testImages = [
    {
      name: 'ASCE Logo',
      url: 'https://pub-a786dffe79f45f1ad652f22091f210.r2.dev/ASCELOGO/ASCE.png'
    },
    {
      name: 'FGM Pic',
      url: 'https://pub-a786dffe79f45f1ad652f22091f210.r2.dev/FGM%20Pics/DSC00698.JPG'
    },
    {
      name: 'Spartan Logo',
      url: 'https://pub-a786dffe79f45f1ad652f22091f210.r2.dev/SJSUSPARTANLOGO/sjsuspartanlogo.png'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Direct R2 URL Test</h1>
      
      <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
        <p>This page tests direct access to your Cloudflare R2 bucket using hardcoded URLs.</p>
        <p className="text-sm mt-2">
          If images load here but not in the rest of your site, the issue is with your code's path resolution, not with the R2 bucket itself.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testImages.map((image, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white shadow">
            <h3 className="font-bold mb-3">{image.name}</h3>
            <div className="relative border rounded mb-2" style={{ minHeight: "200px" }}>
              <img 
                src={image.url} 
                alt={image.name}
                className="w-full h-auto rounded"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  // Find the next sibling element
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div className="hidden text-red-500 text-center p-4">
                ❌ Failed to load image
              </div>
            </div>
            <div className="mt-3 text-xs break-all bg-gray-50 p-2 rounded">
              <p className="font-mono">{image.url}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-blue-100 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Troubleshooting Tips:</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>If images load here, your bucket and CORS are configured correctly</li>
          <li>Check your browser console for any CORS errors</li>
          <li>Verify that image paths in your code exactly match the bucket structure</li>
          <li>Make sure URL encoding is handled properly for paths with spaces or special characters</li>
        </ul>
      </div>
    </div>
  );
} 