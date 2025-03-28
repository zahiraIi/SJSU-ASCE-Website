'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FallbackImage from './components/FallbackImage';
import PhotoGallery from './components/PhotoGallery';
import { getFeaturedPhotos } from './utils/photoData';

interface Officer {
  name: string;
  role: string;
  image: string;
  // Other properties
}

export default function HomePage() {
  // State to track if the page has loaded
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Optimized refs with useRef
  const servicesRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Get featured photos
  const featuredPhotos = useMemo(() => getFeaturedPhotos(8), []);

  // Memoize static data to prevent unnecessary re-renders
  const services = useMemo(() => [
    {
      id: '01',
      title: 'Concrete Canoe',
      description: 'Join our concrete canoe team to design, build, and race a canoe made entirely out of concrete. This flagship competition challenges your engineering skills and creativity.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.79,11.34A2.86,2.86,0,0,0,22,9.38,2.81,2.81,0,0,0,19.13,6.6H15.94C15.94,4.64,14.29,3,12.31,3S8.68,4.64,8.68,6.6H4.87A2.81,2.81,0,0,0,2,9.38a2.86,2.86,0,0,0,1.21,2.34,4.82,4.82,0,0,0,1.53,4.56,5.07,5.07,0,0,0,3.68,1.22h7.48a5.06,5.06,0,0,0,3.68-1.22A5.12,5.12,0,0,0,20.79,11.34Z" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path d="M8.5,15.5h7s.5-3.5-3.5-3.5S8.5,15.5,8.5,15.5Z" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path d="M12,21v-3" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      )
    },
    {
      id: '02',
      title: 'Steel Bridge',
      description: 'Design, fabricate, and construct a scale-model steel bridge. Test your abilities in structural engineering, project management, and fabrication techniques.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M5,12H19" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
          <path 
            d="M5,16H19" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
          <path 
            d="M8,12V16" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
          <path 
            d="M12,12V16" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
          <path 
            d="M16,12V16" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
          <path 
            d="M5,12V8a2,2,0,0,1,2-2H17a2,2,0,0,1,2,2v4" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M5,16v4" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
          <path 
            d="M19,16v4" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            strokeLinecap="round" 
          />
        </svg>
      )
    },
    {
      id: '03',
      title: 'Professional Development',
      description: 'Access workshops, networking events, and industry connections to build your professional skills and prepare for a successful career in civil engineering.',
      icon: (
        <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M17,18a2,2,0,1,0,2,2A2,2,0,0,0,17,18Z" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M7,18a2,2,0,1,0,2,2A2,2,0,0,0,7,18Z" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M19,14.25a3.76,3.76,0,0,0-4-3.5c-2.23,0-4,2.13-4,4.25" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <line 
            x1="12" 
            y1="8" 
            x2="12" 
            y2="15" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M9,14.25a3.76,3.76,0,0,1,4-3.5c2.23,0,4,2.13,4,4.25" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M12,8a2,2,0,1,0-2-2A2,2,0,0,0,12,8Z" 
            stroke="currentColor" 
            strokeWidth={1.5} 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      )
    }
  ], []);

  // Projects data
  const projects = useMemo(() => [
    {
      title: 'Concrete Canoe Competition',
      client: 'ASCE National Competition',
      tags: ['Design', 'Construction', 'Teamwork'],
      image: '/images/projects/09-01-23/DSC00002.jpg',
      href: '/projects/concrete-canoe'
    },
    {
      title: 'Steel Bridge Competition',
      client: 'ASCE National Competition',
      tags: ['Structural', 'Design', 'Engineering'],
      image: '/images/projects/09-01-23/Copy of DSC00016.jpg',
      href: '/projects/steel-bridge'
    },
    {
      title: 'Community Service Projects',
      client: 'Local Community',
      tags: ['Outreach', 'Sustainability', 'Service'],
      image: '/images/projects/09-01-23/DSC00002.jpg',
      href: '/projects/community'
    }
  ], []);

  // Benefits of membership
  const benefits = useMemo(() => [
    {
      title: "Network with professionals",
      description: "Build connections with industry professionals and potential employers through our events and partnerships.",
      icon: (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 20.5H7C4 20.5 2 19 2 15.5V8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5V15.5C22 19 20 20.5 17 20.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Gain practical experience",
      description: "Participate in competitions and projects that give you hands-on experience solving real engineering challenges.",
      icon: (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 22V17C15.5 15.62 16.62 14.5 18 14.5C19.38 14.5 20.5 15.62 20.5 17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.5 22V17C3.5 15.62 4.62 14.5 6 14.5C7.38 14.5 8.5 15.62 8.5 17V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.5 19H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.5 19H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 5C10.6046 5 11.5 4.10457 11.5 3C11.5 1.89543 10.6046 1 9.5 1C8.39543 1 7.5 1.89543 7.5 3C7.5 4.10457 8.39543 5 9.5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 5C15.6046 5 16.5 4.10457 16.5 3C16.5 1.89543 15.6046 1 14.5 1C13.3954 1 12.5 1.89543 12.5 3C12.5 4.10457 13.3954 5 14.5 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 10C12 7.79 10.21 6 8 6C5.79 6 4 7.79 4 10C4 11.27 4.67 11.97 5.27 12.68C5.58 13.06 5.5 13.59 5.5 14H10.5C10.5 13.59 10.42 13.06 10.73 12.68C11.33 11.97 12 11.27 12 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 10C20 7.79 18.21 6 16 6C13.79 6 12 7.79 12 10C12 11.27 12.67 11.97 13.27 12.68C13.58 13.06 13.5 13.59 13.5 14H18.5C18.5 13.59 18.42 13.06 18.73 12.68C19.33 11.97 20 11.27 20 10Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Leadership development",
      description: "Develop leadership skills by taking on roles in project teams, committees, or as chapter officers.",
      icon: (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C14.0711 15 15.75 13.3211 15.75 11.25C15.75 9.17893 14.0711 7.5 12 7.5C9.92893 7.5 8.25 9.17893 8.25 11.25C8.25 13.3211 9.92893 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.98 18.7498C7.07 17.5898 9.21 16.9998 12 16.9998C14.79 16.9998 16.93 17.5898 18.02 18.7498" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.75 4.5H17.25C16.85 4.5 16.5 4.84 16.5 5.25V6.75C16.5 7.16 16.16 7.5 15.75 7.5H14.25C13.84 7.5 13.5 7.16 13.5 6.75V5.25C13.5 4.84 13.85 4.5 14.25 4.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3.42945 14.5695C3.70945 13.9395 4.36945 13.4395 5.36945 13.4395H6.86945C8.15945 13.4395 8.90945 14.1895 8.90945 15.4795V16.9795C8.90945 17.3395 8.56945 17.6795 8.20945 17.6795" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20.5707 14.5695C20.2907 13.9395 19.6307 13.4395 18.6307 13.4395H17.1307C15.8407 13.4395 15.0907 14.1895 15.0907 15.4795V16.9795C15.0907 17.3395 15.4307 17.6795 15.7907 17.6795" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Technical workshops",
      description: "Access specialized workshops and training in civil engineering software, techniques, and emerging technologies.",
      icon: (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 8.5V3.93C22 2.38 21.52 2 19.77 2H15.73C14 2 13.5 2.38 13.5 3.92V8.5C13.5 10.05 14 10.42 15.73 10.42H19.77C21.52 10.42 22 10.05 22 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 19.77V15.73C22 14 21.62 13.5 20.08 13.5H15.5C13.95 13.5 13.58 14 13.58 15.73V19.77C13.58 21.52 13.95 22 15.5 22H20.08C21.62 22 22 21.52 22 19.77Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.42 8.5V3.93C10.42 2.38 9.92 2 8.19 2H4.15C2.38 2 2 2.38 2 3.92V8.5C2 10.05 2.38 10.42 4.15 10.42H8.19C9.92 10.42 10.42 10.05 10.42 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10.42 19.77V15.73C10.42 14 10.05 13.5 8.5 13.5H3.92C2.38 13.5 2 14 2 15.73V19.77C2 21.52 2.38 22 3.92 22H8.5C10.05 22 10.42 21.52 10.42 19.77Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Resume enhancement",
      description: "Add valuable experiences and achievements to your resume that make you stand out to employers.",
      icon: (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 13H12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Scholarship opportunities",
      description: "Access to ASCE scholarships and awards available exclusively to student chapter members.",
      icon: (
        <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 20.5H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 17V20" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8098 2.97997C15.8098 2.97997 14.6198 2.97997 14.1898 4.0299C13.8598 4.9199 14.1798 6.1499 14.1798 6.1499H11.2598V6.14987" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.19078 2.98022C8.19078 2.98022 9.38078 2.98022 9.81078 4.03022C10.1408 4.92022 9.82078 6.15022 9.82078 6.15022H12.7408" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8199 15.9999H8.18994C7.19994 15.9999 6.58994 15.0599 6.91994 14.1399L8.18994 10.5999H15.8199L17.0899 14.1399C17.4199 15.0599 16.8099 15.9999 15.8199 15.9999Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.18994 10.6001L7.64994 8.66008C7.32994 7.75008 7.93994 6.77008 8.89994 6.77008H15.0999C16.0599 6.77008 16.6699 7.75008 16.3499 8.66008L15.8099 10.6001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ], []);

  // Optimized intersection observer setup
  useEffect(() => {
    // Set loaded state after mount
    setIsLoaded(true);
    
    // Create a single IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add animation class and stop observing to save resources
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        root: null, 
        rootMargin: '0px 0px 100px 0px', // Pre-load animations before they're visible
        threshold: 0.1 
      }
    );
    
    // Collect all elements to observe - only observe necessary elements
    const elementsToObserve = [servicesRef.current, projectsRef.current, galleryRef.current].filter(Boolean);
    
    // Use requestAnimationFrame to avoid layout thrashing
    requestAnimationFrame(() => {
      // Observe all valid elements
      elementsToObserve.forEach(element => {
        if (element) observer.observe(element);
      });
    });
    
    // Cleanup function
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <style jsx global>{`
        /* Optimized CSS animations - using will-change for GPU acceleration */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hero-content {
          opacity: 0;
          transform: translateY(20px);
          will-change: opacity, transform;
        }
        
        .page-loaded .hero-content {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(15px);
          will-change: opacity, transform;
        }
        
        /* Optimized glassmorphism effect with reduced blur for better performance */
        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.3);
        }
        
        /* Optimized gradient animation - reduced animation duration */
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .gradient-bg {
          background: linear-gradient(-45deg, #0055A2, #1C88F4, #0B3B2D, #E5A823);
          background-size: 300% 300%;
          animation: gradientBG 12s ease infinite;
        }
      `}</style>
      
      {/* Hero Section - Modern ASCE Team Design */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image with ASCE team */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-blue-900/80 z-10"></div>
          <img 
            src="/images/Photos/FGM Pics/possiblefrontpage.JPG"
            alt="SJSU ASCE team members" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.85]"
          />
        </div>
        
        {/* Content container with improved layout */}
        <div className="container mx-auto px-6 z-20 relative">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:justify-between">
            <div className="md:w-3/5 space-y-6">
              <div className="relative">
                <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-none tracking-wide drop-shadow-lg">
                  SJSU
                  <span className="block mt-2">ASCE</span>
                </h1>
                {/* Accent line */}
                <div className="h-1 w-20 bg-blue-400 mt-6 md:ml-1 mx-auto md:mx-0"></div>
              </div>
              
              <p className="text-white/90 text-xl max-w-xl leading-relaxed">
                Building the future of civil engineering through innovation, collaboration, and leadership.
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                <a 
                  href="/join" 
                  className="px-8 py-3 bg-blue-600 text-white rounded text-sm uppercase tracking-widest hover:bg-blue-700 transition-all duration-300"
                >
                  Join Us
                </a>
                <a 
                  href="/about" 
                  className="px-8 py-3 bg-transparent text-white border border-white/70 rounded text-sm uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
                >
                  Learn More
                </a>
              </div>
              
              {/* Social media links */}
              <div className="flex space-x-4 pt-6 justify-center md:justify-start">
                <a href="https://instagram.com/sjsuasce" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-blue-500/80 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/asce-studentchapter-of-san-jose-state-university/" className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-blue-500/80 transition-all duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="mt-12 md:mt-0 md:w-2/5 flex justify-center">
              <div className="flex flex-col">
                <div className="glass-card rounded-lg p-8 shadow-xl">
                  <h3 className="text-white font-bold text-xl mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Upcoming Events
                  </h3>
                  <ul className="space-y-4">
                    <li className="text-white/80 p-2 rounded">
                      <span className="block text-sm font-medium text-blue-300">APR 20</span>
                      <span className="block">PSWC Competition Prep</span>
                    </li>
                    <li className="text-white/80 p-2 rounded">
                      <span className="block text-sm font-medium text-blue-300">MAY 5</span>
                      <span className="block">Industry Night Mixer</span>
                    </li>
                    <li className="text-white/80 p-2 rounded">
                      <span className="block text-sm font-medium text-blue-300">MAY 15</span>
                      <span className="block">End of Year Celebration</span>
                    </li>
                  </ul>
                  <a 
                    href="/events" 
                    className="inline-flex items-center text-sm text-blue-300 hover:text-blue-200 mt-4"
                  >
                    View all events
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer section */}
      <section className="py-20 bg-white">
        <div className="container-custom px-4 mx-auto">
          <div className="text-center mb-12">
            <h5 className="text-primary uppercase tracking-wider font-medium mb-2">WHAT WE OFFER</h5>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What you can get with ASCE membership</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            {/* Left column with text and image */}
            <div className="space-y-6">
              <p className="text-gray-600 leading-relaxed">
                With over three decades of experience serving civil engineering students, SJSU's ASCE chapter offers specialized opportunities tailored to your academic and professional growth.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We provide access to industry-leading competitions, workshops, and networking events that will prepare you for a successful career in civil engineering.
              </p>
              
              <div className="relative rounded-lg overflow-hidden shadow-md mt-8">
                <img 
                  src="/images/asce-membership.png" 
                  alt="ASCE Membership Benefits" 
                  className="w-full h-auto" 
                  style={{ objectFit: 'cover' }}
                />
                <div className="absolute inset-0 bg-primary bg-opacity-20 hover:bg-opacity-0 transition-all duration-300"></div>
              </div>
              
              <Link 
                href="/membership" 
                className="inline-flex items-center text-primary hover:text-primary-dark transition-colors font-medium mt-4"
              >
                <span>Learn more about membership</span>
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            
            {/* Right column with team photo */}
            <div className="relative rounded-lg overflow-hidden shadow-md border border-gray-100">
              <img 
                src="/images/Photos/FGM Pics/generalmeeting.JPG" 
                alt="SJSU ASCE Team" 
                className="w-full h-full object-cover"
                style={{ maxHeight: '450px' }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-80 text-white p-3 text-center">
                <p className="font-medium">Join our community of passionate civil engineering students!</p>
              </div>
            </div>
          </div>
          
          {/* Benefit cards in 3 columns */}
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="group bg-white border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 rounded-xl transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <div className="inline-flex p-4 bg-blue-50 rounded-full text-primary transition-transform duration-300 group-hover:scale-110">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">{benefit.title}</h3>
                <p className="text-gray-600 text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Moments Section */}
      <section 
        ref={galleryRef} 
        className="py-24 bg-white scroll-animate"
      >
        <div className="container-custom px-4 mx-auto">
          <div className="text-center mb-16">
            <h5 className="text-primary uppercase tracking-wider font-medium mb-3">CHAPTER LIFE</h5>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Moments</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Take a glimpse at our chapter activities, events, and memorable experiences.
            </p>
          </div>
          
          {featuredPhotos.length > 0 && (
            <div className="mb-10">
              <PhotoGallery 
                photos={featuredPhotos}
                autoSlideInterval={4500}
                height="580px"
                showControls={true}
              />
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              href="/gallery" 
              className="inline-flex items-center px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-sm hover:shadow transform hover:-translate-y-0.5"
            >
              <span>View Full Gallery</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-r from-primary to-blue-700 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-white opacity-10 rounded-full transform translate-y-1/2"></div>
        
        <div className="container-custom px-4 mx-auto relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started with ASCE?</h2>
            <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed">
              Join SJSU's ASCE chapter today and gain access to competitions, networking opportunities, 
              workshops, and industry connections that will help you build a successful career in civil engineering.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSfiECNFkhvyP4djptSQvhvxF5ZIKC-blItT9iIoPi72tuesZA/viewform" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-colors duration-300 group"
              >
                <span>Become a Member</span>
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <Link 
                href="/contact" 
                className="inline-flex items-center bg-transparent text-white border border-white px-8 py-4 rounded-md font-medium hover:bg-white hover:text-primary transition-colors duration-300"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 