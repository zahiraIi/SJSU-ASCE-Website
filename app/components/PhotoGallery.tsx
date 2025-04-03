'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
// Removed standard Image import
// import Image from 'next/image';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import R2Image from './R2Image'; // Import R2Image

interface Photo {
  src: string;
  alt: string;
  category: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  title?: string;
  autoSlideInterval?: number; // in milliseconds
  showControls?: boolean;
  height?: string;
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  title,
  autoSlideInterval = 5000, // Default: 5 seconds
  showControls = true,
  height = "500px",
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayPhotos, setDisplayPhotos] = useState<Photo[]>([]);
  // Always slide in one direction
  const [direction] = useState<'next' | 'prev'>('next');
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userInteractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  // Automatically resume sliding after this duration of inactivity (ms)
  const resumeAutoplayDelay = 5000;
  
  // Get adjacent indices for preloading
  const getAdjacentIndices = useCallback((index: number, arrayLength: number) => {
    if (arrayLength <= 1) return [];
    const nextIndex = (index + 1) % arrayLength;
    const prevIndex = index === 0 ? arrayLength - 1 : index - 1;
    return [prevIndex, nextIndex];
  }, []);
  
  // Set photos and randomize them on mount
  useEffect(() => {
    if (photos.length > 0) {
      // Shuffle the photos when the component mounts
      const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
      setDisplayPhotos(shuffledPhotos);
      setCurrentIndex(0);
      setPreviousIndex(0);
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
    };
  }, [photos]);

  // Debug logging to help diagnose the issue
  useEffect(() => {
    console.log(`Current index: ${currentIndex}, Total photos: ${displayPhotos.length}`);
  }, [currentIndex, displayPhotos.length]);

  // Transition control function - always transitions in the "next" direction
  const transition = useCallback((newIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
    
    // Clear transition state after animation completes
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 800); // Match this with CSS transition duration
  }, [currentIndex, isTransitioning]);

  // Function to go to the next photo - always moves forward
  const nextPhoto = useCallback(() => {
    if (displayPhotos.length <= 1) return;
    
    const newIndex = (currentIndex + 1) % displayPhotos.length;
    console.log(`Moving to next photo: ${currentIndex} -> ${newIndex}`);
    transition(newIndex);
  }, [currentIndex, displayPhotos.length, transition]);

  // Function to go to the previous photo - still moves in the same visual direction
  const prevPhoto = useCallback(() => {
    if (displayPhotos.length <= 1) return;
    
    const newIndex = currentIndex === 0 ? displayPhotos.length - 1 : currentIndex - 1;
    console.log(`Moving to previous photo: ${currentIndex} -> ${newIndex}`);
    transition(newIndex);
  }, [currentIndex, displayPhotos.length, transition]);

  // Go to specific photo - always moves in the same visual direction
  const goToPhoto = useCallback((index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    console.log(`Going to specific photo: ${currentIndex} -> ${index}`);
    transition(index);
  }, [currentIndex, isTransitioning, transition]);

  // Mark user interaction and temporarily pause autoplay
  const handleUserInteraction = useCallback(() => {
    setIsUserInteracting(true);
    
    // Clear any existing timeout for resuming
    if (userInteractionTimeoutRef.current) {
      clearTimeout(userInteractionTimeoutRef.current);
    }
    
    // Set timeout to resume autoplay after a period of inactivity
    userInteractionTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, resumeAutoplayDelay);
  }, [resumeAutoplayDelay]);

  // Handle manual navigation
  const handlePrevPhoto = useCallback(() => {
    handleUserInteraction();
    prevPhoto();
  }, [handleUserInteraction, prevPhoto]);

  const handleNextPhoto = useCallback(() => {
    handleUserInteraction();
    nextPhoto();
  }, [handleUserInteraction, nextPhoto]);

  const handleGoToPhoto = useCallback((index: number) => {
    handleUserInteraction();
    goToPhoto(index);
  }, [handleUserInteraction, goToPhoto]);

  // Set up auto-slide effect
  useEffect(() => {
    if (displayPhotos.length <= 1 || isUserInteracting) return;
    
    // Clear any existing interval
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    
    // Set new interval with guaranteed invocation - always advance forward
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextPhoto();
      }
    }, autoSlideInterval);
    
    autoplayRef.current = interval;
    
    // Cleanup on component unmount or when dependencies change
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [nextPhoto, autoSlideInterval, displayPhotos.length, isTransitioning, isUserInteracting]);

  // Clean up all timeouts on unmount
  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      if (userInteractionTimeoutRef.current) {
        clearTimeout(userInteractionTimeoutRef.current);
      }
    };
  }, []);

  // Pause auto-slide on hover/touch
  const handleMouseEnter = useCallback(() => {
    handleUserInteraction();
  }, [handleUserInteraction]);

  // Calculate adjacent indices for preloading
  const adjacentIndices = getAdjacentIndices(currentIndex, displayPhotos.length);
  
  // Load state for initial display
  if (displayPhotos.length === 0) {
    return <div className="text-center p-8">No photos to display</div>;
  }

  return (
    <div className={`photo-gallery ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      
      <div 
        className="relative overflow-hidden rounded-xl shadow-md bg-black"
        style={{ height }}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleMouseEnter}
      >
        {/* Images container with transitions */}
        <div className="absolute inset-0">
          {/* Current Image */}
          {displayPhotos.length > currentIndex && (
            <div 
              className={`absolute inset-0 ${
                isTransitioning ? 'photo-gallery-slide-left' : ''
              }`}
              style={{ zIndex: 20 }}
            >
              <R2Image
                path={displayPhotos[currentIndex].src}
                alt={displayPhotos[currentIndex].alt}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          {/* Previous Image (for transition) */}
          {isTransitioning && displayPhotos.length > previousIndex && (
            <div 
              className="absolute inset-0 photo-gallery-slide-out-left"
              style={{ zIndex: 10 }}
            >
              <R2Image
                path={displayPhotos[previousIndex].src}
                alt={displayPhotos[previousIndex].alt}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          
          {/* Preload adjacent images */}
          {adjacentIndices.map((index) => (
            displayPhotos.length > index && (
              <div key={`preload-${index}`} className="hidden">
                <R2Image
                  path={displayPhotos[index].src}
                  alt={`Preload ${displayPhotos[index].alt}`}
                />
              </div>
            )
          ))}
        </div>

        {/* Gradient overlay for better visibility of controls */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none" />

        {/* Controls - arrows */}
        {showControls && displayPhotos.length > 1 && (
          <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-between p-2 md:p-4 z-30">
            <button 
              onClick={handlePrevPhoto}
              className="bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-full text-white transition-all opacity-70 hover:opacity-100"
              aria-label="Previous photo"
              disabled={isTransitioning}
            >
              <HiChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
            
            <button 
              onClick={handleNextPhoto}
              className="bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 md:p-3 rounded-full text-white transition-all opacity-70 hover:opacity-100"
              aria-label="Next photo"
              disabled={isTransitioning}
            >
              <HiChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>
        )}
        
        {/* Progress indicators */}
        {displayPhotos.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-30">
            {displayPhotos.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => handleGoToPhoto(index)}
                aria-label={`Go to photo ${index + 1}`}
                disabled={isTransitioning}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGallery; 