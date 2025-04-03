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
  fallbackSrc = 'fallback.jpg',
  style = {},
}: R2ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Fetch the image URL from R2 Storage
  useEffect(() => {
    const fetchImage = async () => {
      console.log(`[R2Image] Received path prop: ${path}`);
      if (!path) {
        console.log('[R2Image] Path is empty, setting error.');
        setError(true);
        setIsLoading(false);
        return;
      }
      
      try {
        // console.log('R2Image - Fetching image:', path);
        
        // Get the URL from R2
        console.log(`[R2Image] Calling getR2ImageUrl with path: ${path}`);
        const url = await getR2ImageUrl(path);
        console.log(`[R2Image] Received URL from getR2ImageUrl: ${url}`);
        
        // Set the image URL
        setImageUrl(url);
        setIsLoading(false);
        // console.log('R2Image - Successfully loaded image');
      } catch (err) {
        console.error('R2Image - Error fetching image:', err);
        console.log(`[R2Image] Error occurred for path: ${path}, setting error state.`);
        setError(true);
        setIsLoading(false);
      }
    };
    
    fetchImage();
  }, [path]);
  
  return (
    <div className={`relative ${className}`} style={style}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!isLoading && (
        <img
          src={error ? fallbackSrc : (imageUrl || fallbackSrc)}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
} 