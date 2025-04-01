'use client';

import React, { useState, useEffect } from 'react';
import R2Image from '../components/R2Image';
import { listR2Objects } from '../lib/r2';

export default function R2TestPage() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load files from R2 Storage
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setLoading(true);
        
        // Get all files from the images directory
        const imageFiles = await listR2Objects('images');
        
        setFiles(imageFiles);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading files:', err);
        setError(err.message || 'Failed to load files');
        setLoading(false);
      }
    };
    
    loadFiles();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cloudflare R2 Storage Test</h1>
      
      <div className="mb-8 p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">R2 Storage Testing</h2>
        <p>This page tests loading images from Cloudflare R2 Storage.</p>
        <p className="text-sm mt-4">
          If images don't load, check your R2 configuration and permissions.
        </p>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {files.map((file) => (
          <div key={file} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-medium mb-2 truncate">{file.split('/').pop()}</h3>
            <div className="relative border rounded mb-2" style={{ minHeight: "200px" }}>
              <R2Image 
                path={file}
                alt={file.split('/').pop() || 'R2 image'}
                width="100%"
                height={200}
                className="w-full h-auto"
              />
            </div>
            <div className="text-sm text-gray-500 break-all mt-2 bg-gray-50 p-2 rounded font-mono text-xs">
              {file}
            </div>
          </div>
        ))}
        
        {!loading && files.length === 0 && !error && (
          <div className="col-span-full p-8 text-center text-gray-500">
            <p>No files found in R2 Storage.</p>
            <p className="text-sm mt-2">Upload some images to see them here.</p>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Make sure your Cloudflare R2 bucket is properly set up</li>
          <li>Verify your R2 access credentials</li>
          <li>Check your R2 bucket permissions</li>
          <li>Ensure you've added images to the "images" directory in your bucket</li>
          <li>Verify that your environment variables are correctly set</li>
        </ul>
      </div>
    </div>
  );
} 