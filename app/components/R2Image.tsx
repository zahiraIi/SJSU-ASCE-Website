'use client';

import React, { useState, useEffect } from 'react';
import { getR2ImageUrl } from '../utils/r2ImageLoader';

interface R2ImageProps {
  path: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

/**
 * Component for displaying images from Cloudflare R2 Storage
 */
export default function R2Image({
  path,
  alt,
  width = 500,
  height = 300,
  className = '',
  fallbackSrc = '/images/fallback.jpg',
  style = {},
}: R2ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Convert width and height to appropriate format
  const widthValue = typeof width === 'string' ? width : `${width}px`;
  const heightValue = typeof height === 'string' ? height : `${height}px`;

  // Fetch the image URL from R2 Storage
  useEffect(() => {
    const fetchImage = async () => {
      if (!path) {
        setError(true);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('R2Image - Fetching image:', path);
        
        // Get the URL from R2
        const url = await getR2ImageUrl(path);
        
        // Set the image URL
        setImageUrl(url);
        setIsLoading(false);
        console.log('R2Image - Successfully loaded image');
      } catch (err) {
        console.error('R2Image - Error fetching image:', err);
        setError(true);
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [path]);
  
  const combinedStyle: React.CSSProperties = {
    ...style,
    width: widthValue,
    height: heightValue,
  };
  
  return (
    <div className={`relative ${className}`} style={combinedStyle}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!isLoading && (
        <img
          src={error ? fallbackSrc : (imageUrl || fallbackSrc)}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
} 