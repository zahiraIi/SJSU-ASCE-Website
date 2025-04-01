'use client';

import React, { useState } from 'react';

export default function R2WorkerTestPage() {
  const [path, setPath] = useState('ASCELOGO/ASCE.png');
  const [imgUrl, setImgUrl] = useState(`http://localhost:8787/ASCELOGO/ASCE.png`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testImages = [
    'ASCELOGO/ASCE.png',
    'FGM Pics/DSC00698.JPG',
    'SJSUSPARTANLOGO/sjsuspartanlogo.png',
    'Tabling/ascetabling.jpg',
    'officers/yasmin.JPG',
    'sponsors/kpff.png'
  ];

  const testWorker = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Encode the path for URLs with spaces
      const encodedPath = encodeURIComponent(path);
      const url = `http://localhost:8787/${encodedPath}`;
      
      // Set the image URL for display
      setImgUrl(url);
      
      // Try fetching it to verify the worker is responding
      const response = await fetch(url, { method: 'HEAD' });
      
      if (!response.ok) {
        setError(`Worker returned status: ${response.status} ${response.statusText}`);
      }
    } catch (err: any) {
      setError(`Failed to connect to worker: ${err.message}`);
      console.error('Worker test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">R2 Wrangler Worker Test</h1>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p>
          This page tests your local Wrangler worker serving content from R2.
          Make sure the worker is running with <code>npm run r2-worker</code>
        </p>
      </div>
      
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-grow">
            <label className="block mb-2 font-medium">R2 Object Path:</label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Quick Paths:</label>
            <select 
              className="w-full p-2 border rounded" 
              onChange={(e) => setPath(e.target.value)}
            >
              <option value="">Select a test path</option>
              {testImages.map((img) => (
                <option key={img} value={img}>{img}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={testWorker}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Worker'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Worker URL:</h2>
        <div className="p-2 bg-gray-100 rounded font-mono overflow-x-auto text-sm">
          {imgUrl}
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Image Preview:</h2>
        <div className="relative min-h-[300px] border rounded p-4 flex items-center justify-center">
          <img
            src={imgUrl}
            alt="R2 image via Wrangler worker"
            className="max-h-[300px] max-w-full object-contain"
            onError={() => setError('Failed to load image')}
          />
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2">Troubleshooting:</h3>
        <ul className="list-disc pl-6 space-y-1">
          <li>Make sure Wrangler is running with <code>npm run r2-worker</code></li>
          <li>Check that you've authenticated with <code>npm run wrangler-login</code></li>
          <li>Verify your wrangler.toml has the correct account_id and bucket_name</li>
          <li>Check the Wrangler terminal for error messages</li>
        </ul>
      </div>
    </div>
  );
} 