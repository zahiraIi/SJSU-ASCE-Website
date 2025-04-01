'use client';

import { getImageUrl } from '../utils/imageLoader';
import SimpleImage from '../components/SimpleImage';
import BackblazeImage from '../components/BackblazeImage';

// Example Backblaze B2 file paths for testing
const testImages = [
  {
    id: 'ASCE.png',
    description: 'ASCE Logo',
    path: '/images/ASCELOGO/ASCE.png'
  },
  {
    id: 'Photos/FGM Pics/DSC00698.JPG',
    description: 'FGM Pics - DSC00698',
    path: '/images/Photos/FGM Pics/DSC00698.JPG'
  },
  {
    id: 'Photos/Tabling/ascetabling.jpg',
    description: 'Tabling Photo',
    path: '/images/Photos/Tabling/ascetabling.jpg'
  },
  {
    id: 'Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg',
    description: 'L&L Event Photo',
    path: '/images/Photos/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg'
  }
];

export default function PhotoTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Backblaze B2 Photo Test</h1>
      <p className="mb-8">
        This page demonstrates how to load images directly from Backblaze B2 using file paths,
        which provides a reliable way to load images with proper content types.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Using BackblazeImage Component</h2>
          
          <div className="space-y-8">
            {testImages.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <BackblazeImage
                  path={image.id}
                  alt={image.description}
                  width={500}
                  height={300}
                  className="w-full h-64"
                />
                <div className="p-4">
                  <h3 className="font-medium">{image.description}</h3>
                  <p className="text-sm text-gray-500 mt-1">File Path: {image.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Using Path Mapping Approach</h2>
          
          <div className="space-y-8">
            {testImages.map((image) => (
              <div key={image.path} className="border rounded-lg overflow-hidden">
                <SimpleImage
                  src={getImageUrl(image.path)}
                  alt={image.description}
                  width="100%"
                  height={300}
                  className="w-full h-64"
                />
                <div className="p-4">
                  <h3 className="font-medium">{image.description}</h3>
                  <p className="text-sm text-gray-500 mt-1">Path: {image.path}</p>
                  <p className="text-sm text-gray-500">Resolved URL: {getImageUrl(image.path)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            The <code>SimpleImage</code> component is used for direct rendering without Next.js Image optimization.
          </li>
          <li>
            <code>BackblazeImage</code> component handles direct rendering from the Backblaze B2 bucket.
          </li>
          <li>
            URL paths are properly encoded with <code>encodeURIComponent</code> to handle spaces and special characters.
          </li>
          <li>
            All images are loaded client-side to avoid server-side rendering issues.
          </li>
          <li>
            Both methods use the same underlying approach for reliable image loading.
          </li>
        </ul>
      </div>
    </div>
  );
} 