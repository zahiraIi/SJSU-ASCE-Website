'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import R2Image from './R2Image';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Top section with logo and navigation */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and about */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <R2Image 
                  path="ASCELOGO/ASCE.png"
                  alt="SJSU ASCE Logo" 
                  width={64}
                  height={64}
                  className="brightness-0 invert object-contain"
                />
              </div>
              <span className="text-2xl font-display font-bold text-white ml-3 flex items-center">SJSU ASCE</span>
            </Link>
            <p className="text-gray-400 mb-6">
              American Society of Civil Engineers at San Jose State University - Building the future of civil engineering since 1921.
            </p>
            <div className="flex space-x-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com/sjsuasce" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/asce-studentchapter-of-san-jose-state-university/" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaLinkedin size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/officers" className="text-gray-400 hover:text-white">Meet the Officers</Link></li>
              <li><Link href="/membership" className="text-gray-400 hover:text-white">Membership</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-white">Events</Link></li>
              <li><Link href="/gallery" className="text-gray-400 hover:text-white">Gallery</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              <li><a href="https://forms.google.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Membership Form</a></li>
              <li><a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">Calendar</a></li>
              <li><a href="https://www.asce.org/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">ASCE National</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">Charles W. Davidson College of Engineering</p>
              <p className="mb-2">San Jose State University</p>
              <p className="mb-2">San Jose, CA 95112</p>
              <p className="mb-4">United States</p>
              <a href="mailto:asce@sjsu.edu" className="text-primary hover:text-secondary">asce@sjsu.edu</a>
            </address>
          </div>
        </div>

        {/* Bottom copyright section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="md:flex md:items-center md:justify-between">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} SJSU ASCE. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-400 mr-6">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-400">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 