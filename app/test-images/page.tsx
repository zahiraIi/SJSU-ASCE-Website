'use client';

import React from 'react';
import { getImageUrl } from '../utils/imageLoader';
import SimpleImage from '../components/SimpleImage';
import B2Image from '../components/B2Image';
import PathImage from '../components/PathImage';

// Sample data for testing
const imagePaths = [
  '/images/ASCELOGO/ASCE.png',
  '/images/Photos/Tabling/ascetabling.jpg',
  '/images/Photos/FGM Pics/DSC00698.JPG',
  '/images/Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg',
];

// Example Backblaze B2 file paths for testing
const testImages = [
  {
    id: 'ASCE.png',
    description: 'ASCE Logo',
    path: '/images/ASCELOGO/ASCE.png'
  },
  {
    id: 'Photos/Tabling/ascetabling.jpg',
    description: 'Tabling Photo',
    path: '/images/Photos/Tabling/ascetabling.jpg'
  },
  {
    id: 'Photos/FGM Pics/DSC00698.JPG',
    description: 'FGM Pics - DSC00698',
    path: '/images/Photos/FGM Pics/DSC00698.JPG'
  },
  {
    id: 'Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg',
    description: 'L&L Event Photo',
    path: '/images/Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg'
  }
];

export default function TestImagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Backblaze B2 Image Loading Test</h1>
      
      <div className="mb-12 bg-amber-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Fix Image Loading Issues</h2>
        <p className="mb-4">
          The issues with image loading have been fixed by:
        </p>
        <ol className="list-decimal pl-6 mb-6 space-y-3">
          <li>
            <strong>Using Backblaze B2 Cloud Storage</strong> - 
            Backblaze B2 properly serves images with correct content-type headers.
          </li>
          <li>
            <strong>Using SimpleImage component</strong> - 
            A custom component that bypasses Next.js Image optimization for external images.
          </li>
          <li>
            <strong>Using proper URL encoding</strong> - 
            Ensuring special characters in file paths are properly handled.
          </li>
        </ol>
        <p>
          Below are three different methods to load images, from simplest to most flexible.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-12">
        {/* Method 1: Direct B2Image Component */}
        <section className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Method 1: Direct B2Image Component</h2>
          <p className="mb-4">
            Use the <code>B2Image</code> component when you know the Backblaze B2 file path.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <B2Image 
              fileId="ASCE.png"
              alt="ASCE Logo" 
              width="100%" 
              height={200} 
              className="border rounded"
            />
            <B2Image 
              fileId="Photos/Tabling/ascetabling.jpg"
              alt="ASCE Tabling" 
              width="100%" 
              height={200} 
              className="border rounded"
            />
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Code Example:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`<B2Image 
  fileId="ASCE.png"
  alt="ASCE Logo" 
  width="100%" 
  height={200} 
/>`}
            </pre>
          </div>
        </section>
        
        {/* Method 2: PathImage Component */}
        <section className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Method 2: PathImage Component</h2>
          <p className="mb-4">
            Use the <code>PathImage</code> component when you want to use familiar local file paths.
            It automatically maps paths to Backblaze B2 file paths.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagePaths.map((path) => (
              <div key={path} className="border rounded overflow-hidden">
                <PathImage 
                  src={path}
                  alt={path.split('/').pop() || 'Image'} 
                  width="100%" 
                  height={200} 
                />
                <div className="p-2 bg-gray-50 text-xs truncate">
                  {path}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Code Example:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`<PathImage 
  src="/images/Photos/Tabling/ascetabling.jpg"
  alt="ASCE Tabling" 
  width="100%" 
  height={200} 
/>`}
            </pre>
          </div>
        </section>
        
        {/* Method 3: Direct Image URL */}
        <section className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Method 3: Direct Image URL</h2>
          <p className="mb-4">
            Use the <code>getImageUrl</code> utility function with the <code>SimpleImage</code> component
            for maximum flexibility.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagePaths.map((path) => (
              <div key={path} className="border rounded overflow-hidden">
                <SimpleImage 
                  src={getImageUrl(path)}
                  alt={path.split('/').pop() || 'Image'} 
                  width="100%"
                  height={200}
                  className="w-full"
                />
                <div className="p-2 bg-gray-50 text-xs break-all">
                  URL: {getImageUrl(path)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <h3 className="font-medium mb-2">Code Example:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {`import { getImageUrl } from '../utils/imageLoader';
import SimpleImage from '../components/SimpleImage';

<SimpleImage 
  src={getImageUrl("/images/Photos/Tabling/ascetabling.jpg")}
  alt="ASCE Tabling" 
  width="100%"
  height={200} 
/>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
} 