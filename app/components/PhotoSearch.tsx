'use client';

import React, { useState, useEffect } from 'react';
import { searchPhotosByKeyword, photoCategories } from '../utils/photoData';
import PhotoGallery from './PhotoGallery';
import { Photo } from '../types';

interface PhotoSearchProps {
  defaultHeight?: string;
  showControls?: boolean;
}

const PhotoSearch: React.FC<PhotoSearchProps> = ({ 
  defaultHeight = '500px',
  showControls = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  // Get unique categories from the photoCategories object
  const categories = Object.values(photoCategories);

  // Perform search when search term or category changes
  useEffect(() => {
    if (searchTerm.trim() === '' && !selectedCategory) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Use the search utility to find photos
    const results = searchPhotosByKeyword(searchTerm);
    
    // Filter by category if selected
    const filteredResults = selectedCategory 
      ? results.filter(photo => photo.category === selectedCategory)
      : results;
    
    setSearchResults(filteredResults);
    setIsSearching(false);
  }, [searchTerm, selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already handled by the useEffect
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSearchResults([]);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all pl-10"
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchTerm && (
                <button 
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="button"
            onClick={clearSearch}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
      </form>

      {isSearching ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div>
          <h3 className="text-lg font-medium mb-4">
            Found {searchResults.length} {searchResults.length === 1 ? 'photo' : 'photos'}
          </h3>
          <PhotoGallery 
            photos={searchResults} 
            height={defaultHeight}
            showControls={showControls}
          />
        </div>
      ) : searchTerm || selectedCategory ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">No photos found matching your search.</p>
          <button 
            onClick={clearSearch}
            className="mt-4 text-primary hover:text-primary-dark font-medium"
          >
            Clear search
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default PhotoSearch; 