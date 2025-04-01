'use client';

import React, { useState, useEffect } from 'react';
import R2Image from '../components/R2Image';
import { getR2ImageUrl } from '../utils/r2ImageLoader';

export default function R2TestSimplePage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadImage = async () => {
      try {
        setLoading(true);
        // Simple test with a known image path
        const testPath = 'ASCELOGO/ASCE.png';
        console.log('Trying to load image:', testPath);
        
        const url = await getR2ImageUrl(testPath);
        console.log('Got image URL:', url);
        
        setImageUrl(url);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading image:', err);
        setError(err.message || 'Failed to load image');
        setLoading(false);
      }
    };
    
    loadImage();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Simple R2 Test</h1>
      
      <div className="p-4 bg-yellow-50 rounded-lg mb-8">
        <p>Testing a single image from Cloudflare R2</p>
        <pre className="bg-gray-100 p-2 mt-2 rounded text-xs overflow-auto">
          Environment variables: {process.env.NEXT_PUBLIC_USE_R2_STORAGE ? 'Set' : 'Not set'}
        </pre>
      </div>
      
      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          <h3 className="font-semibold">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {imageUrl && (
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Direct Image Tag:</h2>
          <div className="border rounded p-2 mb-4">
            <img 
              src={imageUrl} 
              alt="Test" 
              className="max-w-full h-auto"
              style={{ maxHeight: '300px' }}
            />
          </div>
          
          <h2 className="text-lg font-semibold mb-4">R2Image Component:</h2>
          <div className="border rounded p-2">
            <R2Image 
              path="ASCELOGO/ASCE.png"
              alt="ASCE Logo" 
              width={400}
              height={300}
            />
          </div>
          
          <h2 className="text-lg font-semibold mt-6 mb-4">Networking Event Image:</h2>
          <div className="border rounded p-2">
            <R2Image 
              path="images/Events/3-20-Networking-Event/DSC02308.JPG"
              alt="Networking Event" 
              width={400}
              height={300}
            />
          </div>
          
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs break-all">
            <strong>Image URL:</strong> {imageUrl}
          </div>
        </div>
      )}
      
      {!loading && !imageUrl && !error && (
        <div className="p-8 text-center text-red-500">
          No image loaded
        </div>
      )}
    </div>
  );
} 