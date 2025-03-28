'use client';

import React from 'react';

interface StaticMapProps {
  address: string;
  className?: string;
}

const StaticMap: React.FC<StaticMapProps> = ({ address, className = '' }) => {
  // Encode the address for the URL
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <div className={`relative w-full h-[300px] overflow-hidden ${className}`}>
      {/* Using a static background with map-like styling */}
      <a 
        href={`https://maps.google.com/?q=${encodedAddress}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block absolute inset-0 bg-blue-50"
      >
        <div className="absolute inset-0 bg-blue-100">
          {/* Create a grid pattern that looks like a map */}
          <div className="w-full h-full opacity-30">
            <div className="grid grid-cols-12 grid-rows-8 h-full">
              {Array(96).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className={`border border-gray-300 ${index % 2 === 0 ? 'bg-blue-200' : 'bg-blue-100'}`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Add a few "roads" */}
          <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-white"></div>
          <div className="absolute top-2/3 left-0 right-0 h-[2px] bg-white"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-[2px] bg-white"></div>
          <div className="absolute top-0 bottom-0 right-1/3 w-[2px] bg-white"></div>
          <div className="absolute top-0 bottom-0 left-2/3 w-[2px] bg-white"></div>
        </div>
        
        {/* Overlay with marker icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-bounce">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            
            {/* Add a shadow below the pin */}
            <div className="w-4 h-1 bg-black/20 mx-auto mt-2 rounded-full"></div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default StaticMap; 