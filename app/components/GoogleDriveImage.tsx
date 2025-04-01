'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface GoogleDriveImageProps extends Omit<ImageProps, 'src'> {
  fileId: string;
  fallbackSrc?: string;
  useThumbnail?: boolean;
}

/**
 * Component for loading images directly from Google Drive by file ID
 */
export default function GoogleDriveImage({
  fileId,
  fallbackSrc = '/images/fallback.jpg',
  useThumbnail = true,
  alt,
  width,
  height,
  ...props
}: GoogleDriveImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate the appropriate Google Drive URL
  const src = useThumbnail 
    ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000` 
    : `https://drive.google.com/uc?export=download&id=${fileId}`;
  
  const handleError = () => {
    console.error(`Failed to load Google Drive image with ID: ${fileId}`);
    setError(true);
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error ? (
        <Image 
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          {...props}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          {...props}
        />
      )}
    </div>
  );
} 