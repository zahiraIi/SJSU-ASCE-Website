'use client';

import React, { useState } from 'react';
import { getB2ImageUrl } from '../utils/imageLoader';

interface B2ImageProps {
  fileId: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

/**
 * Component for loading images directly from Backblaze B2 by file ID
 * using direct HTML img tag which works better for external storage
 */
export default function B2Image({
  fileId,
  alt,
  className = '',
  width,
  height,
  style = {},
  fallbackSrc = '/images/fallback.jpg',
}: B2ImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generate the Backblaze B2 URL
  const src = getB2ImageUrl(fileId);
  
  const handleError = () => {
    console.error(`Failed to load Backblaze B2 image with ID: ${fileId}`);
    setError(true);
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  const combinedStyle: React.CSSProperties = {
    ...style,
    width: width,
    height: height,
    opacity: isLoading ? 0 : 1,
    transition: 'opacity 0.3s ease',
  };
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        className="w-full h-full object-contain"
        style={combinedStyle}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
} 