'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getImageUrl, handleImageError } from '../utils/imageUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/ASCELOGO/officer.jpg',
  className = '',
  fill = false,
  width,
  height,
  priority = false,
  quality = 80,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(getImageUrl(src));
  
  useEffect(() => {
    setImageSrc(getImageUrl(src));
  }, [src]);
  
  const handleError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
    setError(true);
    setIsLoading(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={imageSrc}
        alt={alt}
        className={`${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        quality={quality}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        onLoadingComplete={() => setIsLoading(false)}
        onError={handleError}
      />
      
      {error && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <span className="text-sm text-gray-500">Image failed to load</span>
        </div>
      )}
    </div>
  );
} 