'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import R2Image from '../components/R2Image';

interface Officer {
  name: string;
  role: string;
  image: string;
  email?: string;
  linkedIn?: string;
  bio?: string;
}

export default function OfficersPage() {
  // State for active filter
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  // Refs for animation elements
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Animation effect on scroll - optimized for performance
  useEffect(() => {
    // Fade in header on load with minimal animation
    if (headerRef.current) {
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        headerRef.current!.style.opacity = '0';
        headerRef.current!.style.transform = 'translateY(15px)';
        headerRef.current!.style.willChange = 'opacity, transform';
        
        setTimeout(() => {
          if (headerRef.current) {
            headerRef.current.style.opacity = '1';
            headerRef.current.style.transform = 'translateY(0)';
            
            // Remove willChange after animation completes to free up resources
            setTimeout(() => {
              if (headerRef.current) {
                headerRef.current.style.willChange = 'auto';
              }
            }, 300);
          }
        }, 200); // Reduced delay for faster initial render
      });
    }

    // Optimized staggered card animation on scroll with fewer repaints
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = Array.from(entry.target.querySelectorAll('.officer-card'));
            
            // Batch animations with requestAnimationFrame to reduce layout thrashing
            requestAnimationFrame(() => {
              // Animate fewer cards at once in batches
              cards.forEach((card, index) => {
                const delay = Math.min(index * 80, 400); // Cap maximum delay to 400ms
                setTimeout(() => {
                  (card as HTMLElement).style.opacity = '1';
                  (card as HTMLElement).style.transform = 'translateY(0)';
                }, delay);
              });
            });
            
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px' // Pre-load animations before fully visible
      }
    );

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [activeFilter]);

  // Get role categories for filtering
  const getRoleCategory = (role: string): string => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('president')) return 'executive';
    if (lowerRole.includes('treasurer') || lowerRole.includes('secretary')) return 'executive';
    if (lowerRole.includes('captain')) return 'competition';
    if (lowerRole.includes('network') || lowerRole.includes('event') || lowerRole.includes('media')) return 'events';
    return 'other';
  };

  // Officer information with images from the Photos folder
  const officers: Officer[] = [
    {
      name: "Ankush Bhatia",
      role: "President",
      image: "officers/ankush.jpeg",
      email: "ankush.bhatia@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/ankushbhatia4/",
      bio: "Ankush serves as the President of SJSU's ASCE chapter, leading the organization's initiatives and representing our students in the civil engineering community. He is committed to creating opportunities for professional development and networking."
    },
    {
      name: "Stephanie Morales",
      role: "Vice President",
      image: "officers/stephanie.jpg",
      email: "stephanlouise.morales@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/stephanieluwis/",
      bio: "Stephanie serves as the Vice President of our ASCE chapter. She works closely with the President to coordinate chapter activities and ensure member engagement while helping to implement our organizational goals."
    },
    {
      name: "Asmae Malekifard",
      role: "Secretary",
      image: "officers/asma asce.jpg",
      email: "asmae.malekifard@sjsu.edu",
      bio: "Asmae keeps track of all chapter meetings and communications. She is studying civil engineering with a focus on transportation systems."
    },
    {
      name: "Ben Pham",
      role: "Co-Treasurer",
      image: "officers/d4c39421-4001-41d8-82cd-6ac0fa4c0ade.jpg",
      email: "ben.d.pham@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/ben-dat-pham-civil/",
      bio: "Ben serves as Co-Treasurer, managing the chapter's finances and budgeting alongside Yaser. He is passionate about water resources engineering and sustainable design."
    },
    {
      name: "Yaser Osman",
      role: "Co-Treasurer",
      image: "officers/f1af8a86-dddd-4270-b38a-6fdb16b0b393.jpg",
      email: "yaser.osman@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/yaser-osman-9a99b4343/",
      bio: "Yaser serves as Co-Treasurer, managing the chapter's finances and budgeting alongside Ben. He is also focused on sustainable development and community engagement."
    },
    {
      name: "Maria Isabella Gabrielle Castro",
      role: "Networking Coordinator + Steel Bridge Co-Captain 2",
      image: "officers/maria.jpeg",
      email: "mariaisabellagabrielle.castro@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/maria-castro-705857242/",
      bio: "Maria Isabella (Arielle) coordinates networking events and professional connections for our members. She helps build relationships with industry professionals and other ASCE chapters."
    },
    {
      name: "Loraelyne Gapasin",
      role: "Networking Coordinator Assistant",
      image: "officers/Loraelyne Gapasin.JPG",
      email: "loraelyne.gapasin@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/loraelyne-gapasin-b3ab12294/",
      bio: "Loraelyne assists with organizing networking events and developing professional connections for our members."
    },
    {
      name: "Jamie Lee",
      role: "Networking Coordinator Assistant",
      image: "officers/fb4f7744-c9b1-4e01-9a3a-3c7a70567696.jpg",
      email: "jamie.lee@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/jamie-lee-ce/",
      bio: "Jamie assists with organizing networking events and maintaining relationships with industry partners and professionals."
    },
    {
      name: "Abdelrahman El Kabbany",
      role: "Professional Event Coordinator",
      image: "officers/Del.jpg",
      email: "abdelrahman.elkabbany@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/aelkabbany/",
      bio: "Abdelrahman (Del) organizes professional development events and coordinates with industry partners to provide valuable opportunities for our members."
    },
    {
      name: "Asa Flores",
      role: "Social Event Coordinator",
      image: "officers/b4b92669-664b-423a-8a66-daab75c70f0f.jpg",
      email: "asa.flores@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/asa-flores/",
      bio: "Asa plans and organizes social events that help build community among our members and create networking opportunities in a more relaxed setting."
    },
    {
      name: "April Santillan",
      role: "Mid-Pac Chair",
      image: "officers/f113a098-7ae1-42f6-a4db-8646b671631d.jpg",
      email: "april.santillan@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/april-santillan-286973165/",
      bio: "April coordinates our chapter's participation in the Mid-Pacific Conference, a regional ASCE student competition that brings together civil engineering students from across the region."
    },
    {
      name: "Sonia Guzman",
      role: "Media Officer",
      image: "officers/dddf7369-c4f1-40b8-a0a5-1acdd56f1998.jpg",
      email: "sonia.guzmanalvarez@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/soniaguzmanalvarez/",
      bio: "Sonia manages our social media accounts and digital communications. She showcases our activities and achievements through engaging content."
    },
    {
      name: "Yasmin Bouhedda",
      role: "Media Officer Assistant",
      image: "officers/yasmin.JPG",
      email: "yasmin.bouhedda@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/yasminbouhedda/",
      bio: "Yasmin assists with managing our social media presence and helps create engaging content to showcase our chapter's activities and achievements."
    },
    {
      name: "Ismael Cruz",
      role: "Safety Officer",
      image: "officers/Ismael Cruz.JPG",
      email: "ismael.cruzgraciano@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/ismaelcruzgraciano/",
      bio: "Ismael ensures that all chapter activities adhere to safety guidelines and protocols, particularly for hands-on events and competitions."
    },
    {
      name: "Abdul Alkamez",
      role: "Concrete Canoe Captain",
      image: "officers/Abdul.jpg",
      email: "abdalrahman.alkamez@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/abdalrahman-alkamez/",
      bio: "Abdul leads the Concrete Canoe competition team. He coordinates the design, construction, and racing of our concrete canoe for the annual ASCE competition."
    },
    {
      name: "Alma Mata",
      role: "Steel Bridge Co-Captain 1",
      image: "officers/85f444a7-1db8-4102-ab6e-f44eacf93e2f.jpg",
      email: "alma.mata@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/alma-mata/",
      bio: "Alma co-leads the Steel Bridge competition team, focusing on design and fabrication of the bridge for the annual ASCE competition."
    },
      
    {
      name: "Tia Brunette",
      role: "Sustainable Solutions Captain",
      image: "ASCELOGO/officer.jpg",
      email: "tia.jackson-brunette@sjsu.edu",
      bio: "Tia leads the Sustainable Solutions competition team, focusing on innovative and environmentally friendly civil engineering projects."
    },
    {
      name: "Dr. Akthem Al-Manaseer",
      role: "Faculty Advisor",
      image: "officers/Aktem-Al-Manaseer.jpeg",
      email: "akthem.al-manaseer@sjsu.edu",
      linkedIn: "",
      bio: "Dr. Al-Manaseer provides guidance and support to the ASCE chapter, connecting students with faculty resources and ensuring alignment with university policies."
    },
    
    /*{
      name: "Dr. Laura Sullivan-Green",
      role: "Faculty Advisor",
      image: "officers/DrLauraSullivan-Green.jpeg",
      email: "laura.sullivan-green@sjsu.edu",
      linkedIn: "https://www.linkedin.com/in/laurasullivangreen/",
      bio: "Dr. Sullivan-Green advises the chapter on academic and professional matters, helping students navigate their civil engineering journey at SJSU."
    },*/
  ];

  // Filter officers based on activeFilter
  const filteredOfficers = activeFilter === 'all' 
    ? officers 
    : officers.filter(officer => getRoleCategory(officer.role) === activeFilter);
  
  return (
    <>
      {/* Remove specific style override for officer images */}
      {/* <style jsx global>{`
        .officer-card img {
          object-fit: fill !important; 
        }
      `}</style> */}
    
      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary opacity-5 rounded-full"></div>
          <div className="absolute top-2/3 -right-20 w-80 h-80 bg-secondary opacity-5 rounded-full"></div>
        </div>
        
        <div className="container-custom px-4 mx-auto relative z-10">
          {/* Page Header - Animation on load */}
          <div 
            ref={headerRef}
            className="text-center mb-16 transition-all duration-700 ease-out"
          >
            <h5 className="text-primary uppercase tracking-wider font-medium mb-2">Leadership Team</h5>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Meet Our Officers</h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our dedicated team of officers works tirelessly to bring you opportunities for academic, 
              professional, and personal growth in civil engineering.
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white shadow-md rounded-lg p-2 flex flex-wrap justify-center">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-5 py-3 m-1 rounded-md transition-all ${
                  activeFilter === 'all' 
                    ? 'bg-primary text-white font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                All Officers
              </button>
              <button 
                onClick={() => setActiveFilter('executive')}
                className={`px-5 py-3 m-1 rounded-md transition-all ${
                  activeFilter === 'executive' 
                    ? 'bg-primary text-white font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Executive Board
              </button>
              <button 
                onClick={() => setActiveFilter('competition')}
                className={`px-5 py-3 m-1 rounded-md transition-all ${
                  activeFilter === 'competition' 
                    ? 'bg-primary text-white font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Competition Captains
              </button>
              <button 
                onClick={() => setActiveFilter('events')}
                className={`px-5 py-3 m-1 rounded-md transition-all ${
                  activeFilter === 'events' 
                    ? 'bg-primary text-white font-medium' 
                    : 'hover:bg-gray-100'
                }`}
              >
                Events & Media
              </button>
            </div>
          </div>
          
          {/* Officers Grid - Staggered animation on scroll */}
          <div 
            ref={cardsRef}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {filteredOfficers.map((officer, index) => (
              <div 
                key={index} 
                className="officer-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ease-out transform hover:-translate-y-1 opacity-0 translate-y-8"
                style={{ 
                  transitionDelay: `${Math.min(index * 50, 300)}ms`, // Cap max delay at 300ms
                  transitionProperty: 'opacity, transform',
                  opacity: 0,
                  transform: 'translateY(15px)',
                  willChange: 'transform, opacity'
                }}
              >
                <div className="relative overflow-hidden bg-primary/10 flex items-center justify-center aspect-[3/4]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-all duration-300 z-10 flex items-end">
                    <div className="p-6 text-white">
                      <div className="flex space-x-3 mb-2">
                        {officer.email && (
                          <a 
                            href={`mailto:${officer.email}`}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-all duration-300"
                            aria-label={`Email ${officer.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </a>
                        )}
                        
                        {officer.linkedIn && (
                          <a 
                            href={officer.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-all duration-300"
                            aria-label={`${officer.name}'s LinkedIn profile`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Optimized image loading using R2Image */}
                  <R2Image 
                    path={officer.image}
                    alt={`${officer.name} - ${officer.role}`}
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 ease-out hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{officer.name}</h3>
                  </div>
                  <p className="text-primary font-medium mb-3 pb-3 border-b border-gray-100">{officer.role}</p>
                  
                  {officer.bio && (
                    <p className="text-gray-600 text-sm">{officer.bio.length > 120 ? `${officer.bio.substring(0, 120)}...` : officer.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Call to Action */}
          {/* ... rest of the file ... */}
        </div>
      </div>
    </>
  );
}