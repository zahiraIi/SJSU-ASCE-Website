'use client';

import React from 'react';
import PhotoGallery from '../components/PhotoGallery';
import { getAllPhotos, getPhotosByCategory, photoCategories, getFeaturedPhotos } from '../utils/photoData';

export default function GalleryPage() {
  // These would normally be fetched server-side, but for demo purposes we're using client components
  const allPhotos = getAllPhotos();
  const lunchAndLearnPhotos = getPhotosByCategory(photoCategories.LUNCH_AND_LEARN);
  const socialEventsPhotos = getPhotosByCategory(photoCategories.SOCIAL_EVENTS);
  const networkingPhotos = getPhotosByCategory(photoCategories.NETWORKING);
  const tablingPhotos = getPhotosByCategory(photoCategories.TABLING);
  const featuredPhotos = getFeaturedPhotos(18); // Increased number of featured photos
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="container-custom">
        {/* Page Header */}
        <div className="text-center mb-14">
          <h5 className="text-primary uppercase tracking-wider font-medium mb-2">Our Memories</h5>
          <h1 className="section-title mb-6">Photo Gallery</h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Browse through our collection of photos from various events, activities, and memorable moments.
          </p>
        </div>
        
        {/* Modern Gallery Layout */}
        <div className="space-y-20">
          {/* Hero Gallery - Featured */}
          <div>
            <PhotoGallery 
              photos={featuredPhotos}
              autoSlideInterval={4500}
              height="70vh"
              showControls={true}
              className="shadow-xl"
            />
          </div>
          
          {/* Event Categories in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Lunch & Learn */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold px-6 pt-6 pb-4">Lunch & Learn Events</h2>
              <PhotoGallery 
                photos={lunchAndLearnPhotos}
                autoSlideInterval={5200}
                height="400px"
                showControls={true}
                className="rounded-b-xl"
              />
            </div>
            
            {/* Networking */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold px-6 pt-6 pb-4">Networking Events</h2>
              <PhotoGallery 
                photos={networkingPhotos}
                autoSlideInterval={6300}
                height="400px"
                showControls={true}
                className="rounded-b-xl"
              />
            </div>
            
            {/* Social Events */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold px-6 pt-6 pb-4">Social Events</h2>
              <PhotoGallery 
                photos={socialEventsPhotos}
                autoSlideInterval={5700}
                height="400px"
                showControls={true}
                className="rounded-b-xl"
              />
            </div>
            
            {/* Tabling */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <h2 className="text-xl font-bold px-6 pt-6 pb-4">Tabling Activities</h2>
              <PhotoGallery 
                photos={tablingPhotos}
                autoSlideInterval={6800}
                height="400px"
                showControls={true}
                className="rounded-b-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 