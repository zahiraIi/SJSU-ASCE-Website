import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'SJSU ASCE - American Society of Civil Engineers',
  description: 'San Jose State University American Society of Civil Engineers chapter, dedicated to advancing civil engineering and providing professional development opportunities.',
  keywords: 'SJSU, ASCE, civil engineering, San Jose State University, engineering club, student organization',
  themeColor: '#0055A2',
};

// Optimize viewport settings through metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 2,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Add preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance optimization script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimize animations based on user preference
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
              if (prefersReducedMotion.matches) {
                document.documentElement.classList.add('reduce-motion');
              }
              
              // Optimize rendering
              document.documentElement.classList.add('js-focus-visible');
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 