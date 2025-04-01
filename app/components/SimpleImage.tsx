'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SimpleImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

/**
 * A simple image component that handles errors and loading states
 */
export default function SimpleImage({
  src,
  alt,
  className = '',
  width,
  height,
  style = {},
  fallbackSrc = '/images/fallback.jpg',
}: SimpleImageProps) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Failed to load image: ${src}`, e);
    setError(true);
    setIsLoading(false);
  };
  
  const handleLoad = () => {
    console.log(`Successfully loaded image: ${src}`);
    setIsLoading(false);
  };
  
  useEffect(() => {
    console.log(`SimpleImage - Attempting to load: ${src}`);
    // Reset state when src changes
    setError(false);
    setIsLoading(true);
  }, [src]);
  
  const combinedStyle: React.CSSProperties = {
    ...style,
    objectFit: 'contain',
    width: width || 'auto',
    height: height || 'auto',
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
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 bg-opacity-90 p-4">
          <p className="text-red-600 font-medium">Failed to load image</p>
          <p className="text-sm mt-1 text-gray-700">URL: {src}</p>
          <button 
            className="mt-3 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            onClick={() => {
              setError(false);
              setIsLoading(true);
              // Force reload by creating a new image with timestamp
              const img = new Image();
              img.src = `${src}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
              img.onload = () => {
                setIsLoading(false);
              };
              img.onerror = () => {
                setError(true);
                setIsLoading(false);
              };
            }}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
} 