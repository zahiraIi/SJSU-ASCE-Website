'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '../utils/imageUtils';

const testImages = [
  '/images/ASCELOGO/ASCE.png',
  '/images/Photos/FGM Pics/DSC00698.JPG',
  '/images/Photos/FGM Pics/DSC00700.JPG',
  '/images/Photos/FGM Pics/possiblefrontpage.JPG',
  '/images/Photos/FGM Pics/generalmeeting.JPG',
  '/images/Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg',
  '/images/Photos/L&L/jpg/IMG_1424.jpg',
  '/images/Photos/Tabling/ascetabling.jpg',
  '/images/Photos/Tabling/ascetabling2.jpg',
  '/images/fallback.jpg'
];

export default function ImageTester() {
  const [selectedImage, setSelectedImage] = useState(testImages[0]);
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    console.error('Failed to load image:', selectedImage);
  };

  return (
    <div className="p-6 rounded-lg bg-white shadow-md">
      <h2 className="text-2xl font-bold mb-4">Image Loading Tester</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Test Local Path Mapping</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select an image path:</label>
            <select 
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
            >
              {testImages.map((path) => (
                <option key={path} value={path}>
                  {path}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Or enter custom path:</label>
            <input
              type="text"
              value={selectedImage}
              onChange={(e) => setSelectedImage(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="/images/your-image-path.jpg"
            />
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Resolved URL:</p>
            <code className="block p-2 bg-gray-100 rounded text-sm overflow-auto">
              {getImageUrl(selectedImage)}
            </code>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-3">Test Google Drive URL</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Google Drive URL:</label>
            <input
              type="text"
              value={googleDriveUrl}
              onChange={(e) => setGoogleDriveUrl(e.target.value)}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="https://drive.google.com/file/d/..."
            />
          </div>
          
          {googleDriveUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Resolved URL:</p>
              <code className="block p-2 bg-gray-100 rounded text-sm overflow-auto">
                {getImageUrl(googleDriveUrl)}
              </code>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Image Preview</h3>
        <div className="relative h-80 border rounded-lg overflow-hidden bg-gray-50">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
          
          <img 
            src={getImageUrl(googleDriveUrl || selectedImage)}
            alt="Test image"
            className="w-full h-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Environment Information</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>NEXT_PUBLIC_USE_LOCAL_IMAGES: {process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES || 'not set'}</li>
            <li>NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED: {process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED || 'not set'}</li>
            <li>NODE_ENV: {process.env.NODE_ENV || 'not set'}</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 