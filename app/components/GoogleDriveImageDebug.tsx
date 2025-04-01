'use client';

import { useState, useEffect } from 'react';
import { getImageUrl, getGoogleDriveImageUrl, extractGoogleDriveFileId, getDirectFileUrl } from '../utils/imageUtils';
import Image from 'next/image';

export default function GoogleDriveImageDebug() {
  const [googleDriveUrl, setGoogleDriveUrl] = useState('');
  const [fileId, setFileId] = useState('');
  const [localImagePath, setLocalImagePath] = useState('/images/ASCELOGO/ASCE.png');
  const [resultUrl, setResultUrl] = useState('');
  const [altResultUrl, setAltResultUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [altImageLoaded, setAltImageLoaded] = useState(false);
  
  const [environmentInfo, setEnvironmentInfo] = useState({
    useLocalImages: typeof process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES === 'string' 
      ? process.env.NEXT_PUBLIC_USE_LOCAL_IMAGES : 'not set',
    googleDriveEnabled: typeof process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED === 'string'
      ? process.env.NEXT_PUBLIC_GOOGLE_DRIVE_ENABLED : 'not set',
    googleDriveUrl: typeof process.env.NEXT_PUBLIC_GOOGLE_DRIVE_URL === 'string'
      ? process.env.NEXT_PUBLIC_GOOGLE_DRIVE_URL : 'not set',
    fallbackImage: typeof process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL === 'string'
      ? process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL : 'not set',
    nodeEnv: process.env.NODE_ENV || 'unknown'
  });
  
  useEffect(() => {
    try {
      setError(null);
      if (googleDriveUrl) {
        const extractedId = extractGoogleDriveFileId(googleDriveUrl);
        setFileId(extractedId);
        
        // Get the thumbnail URL
        const directUrl = getGoogleDriveImageUrl(googleDriveUrl);
        setResultUrl(directUrl);
        
        // Get the download URL as an alternative
        const downloadUrl = getDirectFileUrl(extractedId);
        setAltResultUrl(downloadUrl);
      } else if (localImagePath) {
        const url = getImageUrl(localImagePath);
        setResultUrl(url);
        setAltResultUrl('');
      } else {
        setResultUrl('');
        setAltResultUrl('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [googleDriveUrl, localImagePath]);
  
  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Google Drive Image Debug</h2>
      
      <div className="mb-4">
        <h3 className="font-medium mb-2">Environment Variables:</h3>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(environmentInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Google Drive URL:</label>
        <input
          type="text"
          value={googleDriveUrl}
          onChange={(e) => setGoogleDriveUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="https://drive.google.com/file/d/..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Example: https://drive.google.com/file/d/YOUR_FILE_ID/view
        </p>
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Or Enter File ID directly:</label>
        <input
          type="text"
          value={fileId}
          onChange={(e) => {
            setFileId(e.target.value);
            setGoogleDriveUrl(`https://drive.google.com/file/d/${e.target.value}/view`);
          }}
          className="w-full p-2 border rounded"
          placeholder="YOUR_FILE_ID"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2">Local Image Path:</label>
        <input
          type="text"
          value={localImagePath}
          onChange={(e) => {
            setLocalImagePath(e.target.value);
            setGoogleDriveUrl('');
          }}
          className="w-full p-2 border rounded"
          placeholder="/images/..."
        />
      </div>
      
      {resultUrl && (
        <div className="mb-4">
          <label className="block mb-2">Thumbnail URL:</label>
          <input
            type="text"
            value={resultUrl}
            readOnly
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
      )}
      
      {altResultUrl && (
        <div className="mb-4">
          <label className="block mb-2">Download URL (alternative):</label>
          <input
            type="text"
            value={altResultUrl}
            readOnly
            className="w-full p-2 border rounded bg-gray-50"
          />
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {(resultUrl || altResultUrl) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resultUrl && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Method 1: Thumbnail</h3>
              <div className="relative h-64 w-full border rounded overflow-hidden">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    Loading...
                  </div>
                )}
                <img
                  src={resultUrl}
                  alt="Thumbnail preview"
                  className="object-contain w-full h-full"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setError('Failed to load thumbnail image');
                    setImageLoaded(false);
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {imageLoaded ? 'Thumbnail loaded successfully!' : 'Attempting to load thumbnail...'}
              </div>
            </div>
          )}
          
          {altResultUrl && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Method 2: Direct Download</h3>
              <div className="relative h-64 w-full border rounded overflow-hidden">
                {!altImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    Loading...
                  </div>
                )}
                <img
                  src={altResultUrl}
                  alt="Direct download preview"
                  className="object-contain w-full h-full"
                  onLoad={() => setAltImageLoaded(true)}
                  onError={() => {
                    console.error('Failed to load direct download image');
                    setAltImageLoaded(false);
                  }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {altImageLoaded ? 'Direct download loaded successfully!' : 'Attempting to load via direct download...'}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-medium mb-2">Troubleshooting Tips</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Make sure the file in Google Drive is publicly accessible (Anyone with the link can view)</li>
          <li>Right-click on the image in Google Drive and select "Get link"</li>
          <li>Set sharing permissions to "Anyone with the link"</li>
          <li>Some image formats may not work correctly with Google Drive preview</li>
          <li>Check browser console for any CORS errors</li>
        </ul>
      </div>
    </div>
  );
} 