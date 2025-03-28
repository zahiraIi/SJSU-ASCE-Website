'use client';

import React from 'react';
import Image from 'next/image';
import SponsorLogo from './SponsorLogos';

// Updated sponsor data with real companies
const SPONSORS = [
  // Construction Management Companies
  { id: 1, name: 'City of San Jose, Public Works Department', logo: '/images/sponsors/city-of-san-jose-public-works-department.png', url: 'https://www.sanjoseca.gov/your-government/departments-offices/public-works' },
  { id: 2, name: 'DeSilva Gates Construction', logo: '/images/sponsors/desilva-gates-construction.png', url: 'https://desilvagates.com/' },
  { id: 3, name: 'Graniterock', logo: '/images/sponsors/graniterock.png', url: 'https://www.graniterock.com/' },
  { id: 4, name: 'Level 10 Construction', logo: '/images/sponsors/level-10-construction.png', url: 'https://www.level10gc.com/' },
  { id: 5, name: 'McGuire and Hester', logo: '/images/sponsors/mcguire-and-hester.png', url: 'https://www.mcguireandhester.com/' },
  { id: 6, name: 'Performance Contracting, Inc.', logo: '/images/sponsors/performance-contracting-inc.png', url: 'https://www.pcg.com/' },
  { id: 7, name: 'Rodan Builders, Inc.', logo: '/images/sponsors/rodan-builders-inc.png', url: 'https://www.rodanbuilders.com/' },
  { id: 8, name: 'Rudolph and Sletten, Inc.', logo: '/images/sponsors/rudolph-and-sletten-inc.png', url: 'https://www.rsconstruction.com/' },
  { id: 9, name: 'Simpson Gumpertz & Heger', logo: '/images/sponsors/simpson-gumpertz-heger.png', url: 'https://www.sgh.com/' },
  { id: 10, name: 'Technical Builders', logo: '/images/sponsors/technical-builders.png', url: 'https://www.tbibuild.com/' },
  { id: 11, name: 'The CORE Group', logo: '/images/sponsors/the-core-group.png', url: 'https://www.coregroupus.com/' },
  { id: 12, name: 'Vulcan Materials Company', logo: '/images/sponsors/vulcan-materials-company.png', url: 'https://www.vulcanmaterials.com/' },
  { id: 13, name: 'Whiting-Turner', logo: '/images/sponsors/whiting-turner.png', url: 'https://www.whiting-turner.com/' },
  { id: 14, name: 'XL Construction', logo: '/images/sponsors/xl-construction.png', url: 'https://www.xlconstruction.com/' },
  // Structural Companies
  { id: 15, name: 'Kpff', logo: '/images/sponsors/kpff.png', url: 'https://www.kpff.com/' },
  { id: 16, name: 'Mark Thomas', logo: '/images/sponsors/mark-thomas.png', url: 'https://www.markthomas.com/' },
  { id: 17, name: 'PASE', logo: '/images/sponsors/pase.png', url: 'https://www.pase.com/' },
  // Environmental Companies
  { id: 18, name: 'Schaaf & Wheeler Consulting Civil Engineers', logo: '/images/sponsors/schaaf-wheeler-consulting-civil-engineers.png', url: 'https://www.swsv.com/' },
  // Transportation Companies
  { id: 19, name: 'HMH Engineers', logo: '/images/sponsors/hmh-engineers.png', url: 'https://hmhca.com/' },
  { id: 20, name: 'NTK Construction, Inc.', logo: '/images/sponsors/ntk-construction-inc.png', url: 'https://ntkconstruction.com/' },
  // Land Development Companies
  { id: 21, name: 'Carlson, Barbee & Gibson, Inc. (CBG)', logo: '/images/sponsors/carlson-barbee-gibson-inc-cbg.png', url: 'https://cbandg.com/' },
  { id: 22, name: 'Civil Engineering Associates, Inc.', logo: '/images/sponsors/civil-engineering-associates-inc.png', url: 'https://www.civilengineeringassociates.com/' },
  { id: 23, name: 'Ruggeri-Jensen-Azar', logo: '/images/sponsors/ruggeri-jensen-azar.png', url: 'https://www.rja-gps.com/' },
  // Utilities Companies
  { id: 24, name: 'City of Palo Alto', logo: '/images/sponsors/city-of-palo-alto.png', url: 'https://www.cityofpaloalto.org/' },
];


// Enhanced sponsor grid display
const SponsorGrid = ({ sponsors }: { sponsors: typeof SPONSORS }) => {  
  // Function to handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, name: string) => {
    // Try SVG first, then fallback to PNG if SVG fails
    if (e.currentTarget.src.endsWith('.png')) {
      e.currentTarget.src = '/images/sponsors/company-placeholder.svg';
    } else {
      e.currentTarget.src = `/images/sponsors/${name}.png`;
    }
  };
  
  return (
    <div className="py-8 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {sponsors.map(sponsor => (
          <a 
            key={sponsor.id}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-200"
          >
            <div className="h-24 flex items-center justify-center mb-4">
              <img
                src={sponsor.logo}
                alt={`${sponsor.name} logo`}
                className="max-w-full max-h-full object-contain"
                onError={(e) => handleImageError(e, sponsor.name)}
              />
            </div>
            <h3 className="text-center text-sm font-medium">{sponsor.name}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

// Enhanced sponsor slider with two rows scrolling in opposite directions
const SponsorSlider = ({ sponsors }: { sponsors: typeof SPONSORS }) => {
  // Split sponsors into two arrays for top and bottom rows
  const topRowSponsors = sponsors.slice(0, Math.ceil(sponsors.length / 2));
  const bottomRowSponsors = sponsors.slice(Math.ceil(sponsors.length / 2));
  
  // Function to handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, name: string) => {
    // Try SVG first, then fallback to PNG if SVG fails
    if (e.currentTarget.src.endsWith('.png')) {
      e.currentTarget.src = '/images/sponsors/company-placeholder.svg';
    } else {
      e.currentTarget.src = `/images/sponsors/${name}.png`;
    }
  };
  
  return (
    <div className="py-16 bg-white">
      {/* Top row - right to left */}
      <div className="mb-16">
        <div className="relative w-full overflow-hidden py-12 bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10"></div>
          
          <div 
            className="flex gap-10 animate-scroll"
            style={{
              width: 'max-content',
            }}
          >
            {/* Duplicate the sponsors to create an infinite scroll effect */}
            {[...topRowSponsors, ...topRowSponsors, ...topRowSponsors].map((sponsor, index) => (
              <a 
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                key={`top-${sponsor.id}-${index}`}
                className="flex-shrink-0 h-36 w-56 relative transform hover:scale-105 transition-transform duration-300"
              >
                {/* Display logo or fallback to SVG placeholder */}
                <div className="relative h-full w-full">
                  <div className="relative h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md p-5 flex items-center justify-center transition-shadow duration-300">
                    <div className="relative h-full w-full flex items-center justify-center">
                      <img
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => handleImageError(e, sponsor.name)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap px-2">
                        {sponsor.name}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom row - left to right (using a separate animation) */}
      <div>
        <div className="relative w-full overflow-hidden py-12 bg-white">
          <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10"></div>
          
          <div 
            className="flex gap-10 animate-scroll-reverse"
            style={{
              width: 'max-content',
            }}
          >
            {/* Duplicate the sponsors to create an infinite scroll effect */}
            {[...bottomRowSponsors, ...bottomRowSponsors, ...bottomRowSponsors].map((sponsor, index) => (
              <a 
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                key={`bottom-${sponsor.id}-${index}`}
                className="flex-shrink-0 h-32 w-48 relative transform hover:scale-105 transition-transform duration-300"
              >
                {/* Display logo or fallback to SVG placeholder */}
                <div className="relative h-full w-full">
                  <div className="relative h-full w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md p-4 flex items-center justify-center transition-shadow duration-300">
                    <div className="relative h-full w-full flex items-center justify-center">
                      <img
                        src={sponsor.logo}
                        alt={`${sponsor.name} logo`}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => handleImageError(e, sponsor.name)}
                      />
                      <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap px-2">
                        {sponsor.name}
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SponsorsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Our Sponsors</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-10"></div>
          
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            We are grateful to our sponsors who support SJSU ASCE's mission to develop the next generation of civil engineers through competitions, professional development, and community service.
          </p>
        </div>
        
        {/* Enhanced animated sponsor slider with two rows */}
        <SponsorSlider sponsors={SPONSORS} />
        
        {/* Sponsors shown in a simple grid */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Partners</h2>
          <SponsorGrid sponsors={SPONSORS} />
        </div>
        
        {/* Membership Information */}
        <div className="mt-16 mb-16 bg-blue-50 p-8 md:p-12 rounded-xl max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Become a Member</h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Joining SJSU ASCE provides numerous benefits, including networking opportunities, hands-on experience, 
            and access to professional development resources. Membership is free for freshmen and affordable for all students.
          </p>
          <div className="flex justify-center">
            <a 
              href="https://docs.google.com/forms/d/e/1FAIpQLSfiECNFkhvyP4djptSQvhvxF5ZIKC-blItT9iIoPi72tuesZA/viewform"
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center px-8 py-4 bg-secondary text-primary rounded-md font-medium hover:bg-secondary/90 transition-all duration-300"
            >
              <span>Fill Out the Membership Form</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* CTA for potential sponsors */}
        <div className="mt-24 bg-gray-50 p-8 md:p-12 rounded-xl max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Become a Sponsor</h2>
          <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
            Interested in supporting the next generation of civil engineers? Partner with SJSU ASCE to gain visibility and connect with talented engineering students.
          </p>
          <div className="flex justify-center">
            <a 
              href="/contact" 
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-all duration-300"
            >
              <span>Contact Us About Sponsorship</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 