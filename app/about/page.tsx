'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OptimizedImage from '../components/OptimizedImage';

interface Officer {
  name: string;
  role: string;
  image: string;
  email?: string;
  linkedIn?: string;
  bio?: string;
}

export default function AboutPage() {
  // Track if components are loaded to prevent animations before hydration
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Refs for animation elements
  const headerRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const officersRef = useRef<HTMLDivElement>(null);

  // Function to ensure proper image path formatting with optimized paths
  const getImageUrl = (imagePath: string) => {
    // Extract just the filename from complex paths
    if (imagePath.includes('Photos') || imagePath.includes('drive-download')) {
      const fileName = imagePath.split('/').pop() || '';
      return `/images/ASCELOGO/officer.jpg`; // Use default officer image for now
    }
    
    // Always start from the public folder root
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    // Handle spaces in filenames by encoding them
    return path.replace(/ /g, '%20');
  };

  // Add a function to generate a more optimized image path
  const getOptimizedImagePath = (originalPath: string) => {
    // Try to use a more direct path if available
    const fileName = originalPath.split('/').pop() || '';
    return `/images/officers/${fileName}`;
  };

  // Optimized animation effect on scroll
  useEffect(() => {
    // Set loaded state after client-side hydration
    setIsLoaded(true);
    
    // Fade in header on load - more performant with requestAnimationFrame
    if (headerRef.current) {
      requestAnimationFrame(() => {
        if (headerRef.current) {
          headerRef.current.style.opacity = '0';
          headerRef.current.style.transform = 'translateY(20px)';
          headerRef.current.style.willChange = 'opacity, transform';
          
          setTimeout(() => {
            if (headerRef.current) {
              headerRef.current.style.opacity = '1';
              headerRef.current.style.transform = 'translateY(0)';
              
              // Remove willChange after animation to free GPU resources
              setTimeout(() => {
                if (headerRef.current) {
                  headerRef.current.style.willChange = 'auto';
                }
              }, 600);
            }
          }, 100);
        }
      });
    }

    // Create optimized intersection observer for scroll animations with larger rootMargin
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 150px 0px', // Preload elements before they're visible
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Use requestAnimationFrame to batch visual updates
          requestAnimationFrame(() => {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          });
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe mission section
    if (missionRef.current) {
      observer.observe(missionRef.current);
    }

    // Optimize officer cards loading with limited staggered animation
    if (officersRef.current) {
      const cards = Array.from(officersRef.current.querySelectorAll('.officer-card'));
      cards.forEach((card, index) => {
        // Calculate staggered delay with better spacing
        const delay = Math.min(index * 100, 600);
        (card as HTMLElement).style.transitionDelay = `${delay}ms`;
        observer.observe(card);
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Officer information with images from the downloaded folder
  const officers: Officer[] = [
    {
      name: "Ankush",
      role: "President",
      image: "/images/officers/ankush.jpeg", 
      email: "ankush@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/ankushbhatia4/"
    },
    {
      name: "Stephanie",
      role: "Vice President",
      image: "/images/officers/stephanie.jpg", 
      email: "stephanie@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/stephanieluwis/"
    },
    {
      name: "Asmae",
      role: "Secretary",
      image: "/images/officers/asma asce.jpg", 
      email: "asmae@sjsu.edu"
    },
    {
      name: "Ben",
      role: "Co-Treasurer",
      image: "/images/officers/d4c39421-4001-41d8-82cd-6ac0fa4c0ade.jpg",
      email: "ben@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/ben-dat-pham-civil/"
    },
    {
      name: "Alma",
      role: "Membership Chair",
      image: "/images/officers/85f444a7-1db8-4102-ab6e-f44eacf93e2f.jpg",
      email: "alma@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/alma-mata/"
    },
    {
      name: "April",
      role: "Project Manager",
      image: "/images/officers/f113a098-7ae1-42f6-a4db-8646b671631d.jpg",
      email: "april@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/april-santillan-286973165/"
    },
    {
      name: "Del",
      role: "Events Coordinator",
      image: "/images/officers/Del.jpg",
      email: "del@sjsu.edu"
    },
    {
      name: "Asa",
      role: "Technical Activities Chair",
      image: "/images/officers/b4b92669-664b-423a-8a66-daab75c70f0f.jpg",
      email: "asa@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/asa-flores/"
    },
    {
      name: "Sonia",
      role: "Steel Bridge Captain",
      image: "/images/officers/dddf7369-c4f1-40b8-a0a5-1acdd56f1998.jpg",
      email: "sonia@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/soniaguzmanalvarez/"
    },
    {
      name: "Jamie",
      role: "Concrete Canoe Captain",
      image: "/images/officers/fb4f7744-c9b1-4e01-9a3a-3c7a70567696.jpg",
      email: "jamie@sjsu.edu"
    },
    {
      name: "Yaser",
      role: "Co-Treasurer",
      image: "/images/officers/f1af8a86-dddd-4270-b38a-6fdb16b0b393.jpg",
      email: "yaser@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/yaser-osman-9a99b4343/"
    }
  ];
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
      <style jsx global>{`
        /* Smooth animation for elements coming into view */
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                     transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }
        
        /* Image styling with smooth transitions */
        .officer-card-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 5;
          transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background-color: #f3f4f6;
        }
        
        /* Smooth scaling animation on hover */
        .officer-card:hover .officer-card-image {
          transform: scale(1.08);
        }
        
        .officer-image-container {
          position: relative;
          background-color: #f3f4f6;
          aspect-ratio: 3/4;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        /* Improved loading state with fade animation */
        .image-loading-placeholder {
          position: absolute;
          inset: 0;
          z-index: 4;
          background-color: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.4s ease;
        }
        
        /* Enhanced card animations with smooth transitions */
        .officer-card {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: transform, opacity, box-shadow;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                     opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                     box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        /* Enhanced hover animation */
        @media (prefers-reduced-motion: no-preference) {
          .officer-card:hover {
            transform: translateY(-12px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 
                       0 8px 10px -6px rgba(0, 0, 0, 0.1);
          }
          
          .officer-card:hover .absolute.bg-gradient-to-t {
            opacity: 1 !important;
          }
        }
        
        /* Smooth transition for contact icons */
        .icon-link {
          transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                     background-color 0.3s ease;
        }
        
        .icon-link:hover {
          transform: translateY(-3px);
        }
      `}</style>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary opacity-5 rounded-full"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-secondary opacity-5 rounded-full"></div>
      </div>
      
      <div className="container-custom px-4 mx-auto relative z-10">
        {/* Page Header - Animation on load */}
        <div 
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-700 ease-out ${isLoaded ? '' : 'opacity-0'}`}
        >
          <h5 className="text-primary uppercase tracking-wider font-medium mb-3">Who We Are</h5>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About SJSU ASCE</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        </div>
        
        {/* Mission Statement Section */}
        <div 
          ref={missionRef}
          className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-md p-10 mb-24 opacity-0 transform translate-y-10 transition-all duration-0"
        >
          <div className="absolute -top-5 left-10 bg-primary text-white px-6 py-2 rounded-md">
            <h2 className="text-xl font-bold">Our Mission</h2>
          </div>
          
          <div className="mt-6">
            <p className="text-lg mb-6 leading-relaxed">
              The mission of the American Society of Civil Engineers at San Jose State University is to provide students with opportunities
              for academic, professional, and personal growth in the field of civil engineering through educational programs, networking events,
              community service, and competitive engineering projects.
            </p>
            <p className="text-lg leading-relaxed">
              We strive to prepare the next generation of civil engineers to design, build, and maintain the infrastructure of tomorrow
              with integrity, innovation, and environmental consciousness.
            </p>
          </div>
          
          <div className="absolute w-24 h-24 -bottom-12 right-10 bg-primary bg-opacity-10 rounded-full"></div>
          <div className="absolute w-16 h-16 -bottom-8 right-24 bg-primary bg-opacity-20 rounded-full"></div>
        </div>
        
        {/* Officers Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h5 className="text-primary uppercase tracking-wider font-medium mb-3">Our Team</h5>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Meet Our Officers</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div 
            ref={officersRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {officers.slice(0, 6).map((officer, index) => (
              <div 
                key={index} 
                className="officer-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl opacity-0 translate-y-10 transition-duration-0"
              >
                <div className="officer-image-container">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-all duration-500 z-10 flex items-end p-4">
                    <div className="w-full text-white">
                      <div className="flex space-x-3 mb-2">
                        {officer.email && (
                          <a 
                            href={`mailto:${officer.email}`} 
                            className="icon-link w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/90"
                            aria-label={`Email ${officer.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                            </svg>
                          </a>
                        )}
                        
                        {officer.linkedIn && (
                          <a 
                            href={officer.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-link w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/90"
                            aria-label={`${officer.name}'s LinkedIn profile`}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Simple direct image tag as immediate solution */}
                  <img
                    src={officer.image}
                    alt={`${officer.name} - ${officer.role}`}
                    className="officer-card-image"
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to default officer image if loading fails
                      console.log(`Failed to load image: ${officer.image}`);
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/ASCELOGO/officer.jpg';
                    }}
                  />
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800">{officer.name}</h3>
                  <p className="text-primary font-medium mt-1">{officer.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/officers" 
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] group"
            >
              <span>View All Officers</span>
              <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Join Us Section with enhanced animation */}
        <div className="max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:shadow-lg">
          <div className="p-1 bg-gradient-to-r from-primary via-primary-dark to-secondary"></div>
          <div className="bg-white p-8 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Join SJSU ASCE Today</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Become a part of our community and gain access to professional development opportunities,
              networking events, technical workshops, and exciting engineering competitions.
            </p>
            <Link 
              href="/membership" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white text-base font-medium rounded-lg shadow-sm hover:bg-primary-dark transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] group"
            >
              <span>Become a Member</span>
              <svg className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 