'use client';

import React, { useState, useEffect } from 'react';
import R2Image from './R2Image';
import SimpleImage from './SimpleImage';
import { getR2PathFromLocal } from '../utils/r2ImageLoader';

interface R2PathImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fallbackSrc?: string;
  style?: React.CSSProperties;
}

/**
 * Component that takes a local image path and serves it from Cloudflare R2 Storage
 * if there is a mapping available in PATH_TO_R2_MAP.
 */
export default function R2PathImage({
  src,
  alt,
  width = 500,
  height = 300,
  className = '',
  fallbackSrc = '/images/fallback.jpg',
  style = {},
}: R2PathImageProps) {
  const [r2Path, setR2Path] = useState<string | null>(null);
  
  // Determine if we have an R2 path for this local path
  useEffect(() => {
    if (src) {
      const path = getR2PathFromLocal(src);
      setR2Path(path);
    }
  }, [src]);
  
  // If we have an R2 path, use the R2Image component
  if (r2Path) {
    return (
      <R2Image
        path={r2Path}
        alt={alt}
        width={width}
        height={height}
        className={className}
        fallbackSrc={fallbackSrc}
        style={style}
      />
    );
  }
  
  // If no R2 path is found, fall back to a regular image tag
  return (
    <SimpleImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fallbackSrc={fallbackSrc}
      style={style}
    />
  );
} 