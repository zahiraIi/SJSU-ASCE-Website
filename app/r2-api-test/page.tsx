'use client';

import React, { useState, useEffect } from 'react';

export default function R2ApiTestPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const testPath = 'images/ASCE.png';
  const apiUrl = `/api/r2image?path=${encodeURIComponent(testPath)}`;
  
  // Test loading the image directly via img tag
  const testDirectLoading = () => {
    setLoading(true);
    setError(null);
    
    // Create an image element to test loading
    const img = new Image();
    img.onload = () => {
      console.log('Image loaded successfully');
      setImageSrc(apiUrl);
      setLoading(false);
    };
    img.onerror = (e) => {
      console.error('Error loading image:', e);
      setError('Failed to load image');
      setLoading(false);
    };
    img.src = apiUrl;
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">R2 API Route Test</h1>
      
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
        <p>Testing the R2 API route directly.</p>
        <p className="mt-2">API URL: <code className="bg-gray-100 px-2 py-1 rounded">{apiUrl}</code></p>
      </div>
      
      <div className="mb-6">
        <button 
          onClick={testDirectLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Test Image Loading'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {imageSrc && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Image from API Route:</h2>
          <div className="border rounded p-2">
            <img 
              src={imageSrc} 
              alt="ASCE Logo" 
              className="max-w-full h-auto"
              style={{ maxHeight: '300px' }}
            />
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Check server logs for API route errors</li>
          <li>Verify R2 credentials in environment variables</li>
          <li>Make sure the image file exists in the bucket</li>
          <li>Check browser console for network errors</li>
        </ul>
      </div>
    </div>
  );
} 