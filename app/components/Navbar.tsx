'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

// SJSU Official Colors
const SJSU_COLORS = {
  blue: '#0055A2',
  gold: '#E5A823',
  gray: '#939597',
  darkGray: '#666666',
  lightGray: '#D2D2D2',
  rolloverBlue: '#1C88F4',
};

// Nav link component for desktop with animation
const NavLink = ({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) => {
  return (
    <Link 
      href={href} 
      className={`nav-link px-4 py-2 relative text-sm tracking-wide font-medium transition-all duration-200 ${
        active ? 'text-white' : 'text-white/90 hover:text-[#E5A823]'
      }`}
    >
      {children}
    </Link>
  );
};

// Nav link component for mobile menu
const MobileNavLink = ({ href, children, onClick, active = false }: { href: string; children: React.ReactNode; onClick: () => void; active?: boolean }) => {
  return (
    <Link 
      href={href} 
      className={`block py-3 px-4 text-sm font-medium border-l-4 transition-all duration-300 ${
        active ? 'border-[#E5A823] text-[#0055A2] bg-blue-50' : 
        'border-transparent hover:border-[#E5A823] hover:text-[#E5A823] hover:bg-blue-50'
      }`} 
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const navbarRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Handle scroll event to change navbar styling - optimized for performance
  useEffect(() => {
    // Force navbar to be visible at the start
    setIsHidden(false);
    
    // Use passive event listeners for better performance
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't run if we're already processing a scroll event
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // Set scrolled state based on scroll position (for styling)
          setIsScrolled(currentScrollY > 20);
          
          // Handle navbar visibility based on scroll direction
          if (currentScrollY > 150) { // Only hide after scrolling down a bit
            // Scrolling down
            if (currentScrollY > lastScrollY.current + 10) {
              setIsHidden(true);
            } 
            // Scrolling up
            else if (currentScrollY < lastScrollY.current - 10) {
              setIsHidden(false);
            }
          } else {
            // Always show navbar at the top of the page
            setIsHidden(false);
          }
          
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };
    
    // Get current path
    setActivePath(window.location.pathname);

    // Add scroll event listener with passive option for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial values
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Remove initial animation that conflicts with hiding
  useEffect(() => {
    if (navbarRef.current) {
      navbarRef.current.style.opacity = '1';
    }
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (!mobileMenuOpen) {
      // When opening the menu, ensure navbar is visible
      setIsHidden(false);
    }
  };

  return (
    <header 
      ref={navbarRef}
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? 'py-2 bg-white shadow-md' : 'py-2 bg-[#0055A2] border-b-4 border-[#E5A823]'
      }`}
      style={{ 
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
        willChange: 'transform'
      }}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group py-1">
          <div className={`relative ${isScrolled ? 'h-10 w-24' : 'h-12 w-24'} mr-2 overflow-hidden transition-all duration-200`}>
            <Image 
              src="/images/ASCELOGO/ASCE.png"
              alt="SJSU ASCE Logo" 
              fill
              priority
              sizes="96px"
              style={{ objectFit: 'contain', objectPosition: 'left center', willChange: 'auto' }}
              className={isScrolled ? "brightness-0 invert" : "brightness-100 invert-0"}
            />
          </div>
          <div className="flex flex-col ml-1">
            <span className={`${isScrolled ? 'text-lg' : 'text-xl'} font-bold leading-tight transition-all duration-200 ${
              isScrolled ? 'text-[#0055A2]' : 'text-white'
            }`}>SJSU ASCE</span>
            <span className={`${isScrolled ? 'text-xs' : 'text-sm'} leading-tight transition-all duration-200 ${
              isScrolled ? 'text-gray-600' : 'text-gray-200'
            }`}>Student Chapter</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 transition-colors duration-300 text-white">
          <NavLink href="/about" active={activePath === '/about'}>About</NavLink>
          <NavLink href="/events" active={activePath === '/events'}>Events</NavLink>
          <NavLink href="/sponsors" active={activePath === '/sponsors'}>Sponsors</NavLink>
          <NavLink href="/gallery" active={activePath === '/gallery'}>Gallery</NavLink>
          <NavLink href="/contact" active={activePath === '/contact'}>Contact</NavLink>
        </div>
        
        {/* Social icons separate from main nav */}
        <div className="hidden md:flex items-center space-x-3">
          <a href="https://www.instagram.com/sjsuasce/" className="text-white hover:text-[#E5A823] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/asce-studentchapter-of-san-jose-state-university/" className="text-white hover:text-[#E5A823] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={`md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ${
            isScrolled
              ? 'bg-gray-100 text-[#0055A2] focus:ring-[#0055A2]'
              : 'bg-white/10 text-white focus:ring-white backdrop-blur-sm'
          }`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-5 h-5" />
          ) : (
            <FaBars className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu with animation */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg border-t border-gray-100 overflow-hidden animate-slideDown"
          style={{ 
            maxHeight: mobileMenuOpen ? '100vh' : '0',
            transition: 'max-height 0.5s ease-in-out'
          }}
        >
          <div className="flex flex-col p-5">
            <MobileNavLink href="/about" onClick={toggleMobileMenu} active={activePath === '/about'}>About</MobileNavLink>
            <MobileNavLink href="/events" onClick={toggleMobileMenu} active={activePath === '/events'}>Events</MobileNavLink>
            <MobileNavLink href="/sponsors" onClick={toggleMobileMenu} active={activePath === '/sponsors'}>Sponsors</MobileNavLink>
            <MobileNavLink href="/gallery" onClick={toggleMobileMenu} active={activePath === '/gallery'}>Galleries</MobileNavLink>
            <MobileNavLink href="/contact" onClick={toggleMobileMenu} active={activePath === '/contact'}>Contact</MobileNavLink>
            
            <div className="mt-4 flex justify-center gap-6 pt-4 border-t border-gray-100">
              <a href="https://www.instagram.com/sjsuasce/" className="text-gray-600 hover:text-[#E5A823]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/asce-studentchapter-of-san-jose-state-university/" className="text-gray-600 hover:text-[#E5A823]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 