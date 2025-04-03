'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface FallbackImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = 'fallback.jpg',
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
} 