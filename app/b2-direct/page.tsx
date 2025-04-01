'use client';

import React, { useState, useEffect } from 'react';
import BackblazeImage from '../components/BackblazeImage';
import { getPublicUrl } from '../lib/backblaze';

// Test images to display
const testImages = [
  {
    path: 'ASCE.png',
    name: 'ASCE Logo',
  },
  {
    path: 'Photos/FGM Pics/DSC00698.JPG',
    name: 'DSC00698.JPG',
  },
  {
    path: 'Photos/FGM Pics/DSC00700.JPG',
    name: 'DSC00700.JPG',
  },
  {
    path: 'Photos/FGM Pics/possiblefrontpage.JPG',
    name: 'possiblefrontpage.JPG',
  }
];

/**
 * Test page for the improved B2 implementation
 */
export default function B2DirectTestPage() {
  const [testType, setTestType] = useState<'api' | 'direct'>('api');
  const [imageStatus, setImageStatus] = useState<Record<string, boolean>>({});

  // Function to manually check if an image is accessible
  const checkImageExists = async (path: string) => {
    try {
      const directUrl = getPublicUrl(path);
      const response = await fetch(directUrl, { method: 'HEAD' });
      return response.ok;
    } catch (e) {
      return false;
    }
  };

  // Check all images on mount
  useEffect(() => {
    const checkAllImages = async () => {
      const statuses: Record<string, boolean> = {};
      
      for (const image of testImages) {
        statuses[image.path] = await checkImageExists(image.path);
      }
      
      setImageStatus(statuses);
    };
    
    checkAllImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Backblaze B2 Direct Access Test</h1>
      
      <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Improved B2 Image Testing</h2>
        <p>This page tests the improved method for loading images from Backblaze B2.</p>
        <p className="text-sm mt-4">
          It uses a server-side API route to fetch images with proper authentication and content types.
        </p>
      </div>
      
      {/* Test Type Selector */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium mb-2">Image Loading Method</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setTestType('api')}
            className={`px-3 py-1 text-sm rounded ${testType === 'api' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Using API Route
          </button>
          <button 
            onClick={() => setTestType('direct')}
            className={`px-3 py-1 text-sm rounded ${testType === 'direct' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Direct URLs
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Current method: {testType === 'api' ? 'API Route (Recommended)' : 'Direct URLs (Less Reliable)'}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testImages.map((image) => (
          <div key={image.path} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-2">{image.name}</h3>
            <div className="relative border rounded mb-2" style={{ minHeight: "200px" }}>
              {testType === 'api' ? (
                <BackblazeImage 
                  path={image.path}
                  alt={image.name}
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
              ) : (
                <img 
                  src={getPublicUrl(image.path)}
                  alt={image.name}
                  className="w-full h-auto object-contain max-h-60"
                  onError={(e) => {
                    console.error(`Direct URL failed: ${getPublicUrl(image.path)}`);
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML += `
                      <div class="absolute inset-0 flex items-center justify-center bg-red-50">
                        <div class="text-center p-4">
                          <p class="text-red-500 font-medium">Failed to load image</p>
                          <p class="text-sm mt-2">Direct URL doesn't work</p>
                        </div>
                      </div>
                    `;
                  }}
                />
              )}
            </div>
            <div className="text-sm text-gray-500 break-all mt-2 bg-gray-50 p-2 rounded font-mono text-xs">
              {testType === 'api' 
                ? `/api/b2image?path=${encodeURIComponent(image.path)}`
                : getPublicUrl(image.path)
              }
            </div>
            <div className="mt-2">
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                imageStatus[image.path] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {imageStatus[image.path] ? 'Image exists in bucket' : 'Image not found in bucket'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Technical Details</h2>
        <p className="mb-2">This implementation:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Uses server-side API routes to fetch images with proper authentication</li>
          <li>Sets correct content-type headers based on the image file type</li>
          <li>Implements proper error handling and loading states</li>
          <li>Features built-in image existence checking</li>
        </ul>
      </div>
    </div>
  );
} 