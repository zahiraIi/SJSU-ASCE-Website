'use client';

import React from 'react';
import { getImageUrl, getFileIdFromPath } from '../utils/imageLoader';
import B2Image from './B2Image';
import SimpleImage from './SimpleImage';

interface PathImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
}

/**
 * Component that takes a local image path but serves it from Backblaze B2
 * if there is a mapping available in the PATH_TO_ID_MAP.
 */
export default function PathImage({
  src,
  alt,
  className = '',
  width,
  height,
  style = {},
  fallbackSrc = '/images/fallback.jpg',
}: PathImageProps) {
  // Get the file ID for this path, if available
  const fileId = getFileIdFromPath(src);
  
  // If we have a file ID, use the B2Image component
  if (fileId) {
    return (
      <B2Image
        fileId={fileId}
        alt={alt}
        className={className}
        width={width}
        height={height}
        style={style}
        fallbackSrc={fallbackSrc}
      />
    );
  }
  
  // Otherwise, use a regular img tag with the processed URL
  const imageUrl = getImageUrl(src);
  
  return (
    <SimpleImage
      src={imageUrl}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={style}
      fallbackSrc={fallbackSrc}
    />
  );
} 