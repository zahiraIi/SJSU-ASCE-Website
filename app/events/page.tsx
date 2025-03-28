'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PhotoGallery from '../components/PhotoGallery';
import { getPhotosByCategory } from '../utils/photoData';

// Define CalendarEvent interface here instead of importing it
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  category?: string;
  link?: string;
}

// Event categories with icons
const eventCategoryIcons = {
  "Workshops & Training": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  "Competitions": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  "Networking Events": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  "General": (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )
};

// Format date and time for display
function formatEventDate(date: Date) {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

function formatEventTime(startDate: Date, endDate: Date) {
  // Check if it's an all-day event
  if (
    startDate.getHours() === 0 && 
    startDate.getMinutes() === 0 && 
    endDate.getHours() === 0 && 
    endDate.getMinutes() === 0 &&
    endDate.getDate() - startDate.getDate() === 1
  ) {
    return 'All day';
  }
  
  return `${startDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })} - ${endDate.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })}`;
}

export default function EventsPage() {
  // Get photos for events categories
  const socialPhotos = getPhotosByCategory('Social Events');
  const tablingPhotos = getPhotosByCategory('Tabling');
  const lunchLearnPhotos = getPhotosByCategory('Lunch & Learn');
  
  // State for dynamically loaded events
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventsByCategory, setEventsByCategory] = useState<{[key: string]: CalendarEvent[]}>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [calendarUrl, setCalendarUrl] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  
  // Categories we want to display
  const displayCategories = [
    'Workshops & Training',
    'Competitions',
    'Networking Events',
    'General'
  ];
  
  // Load events from API route
  useEffect(() => {
    async function loadEvents() {
      try {
        setIsLoading(true);
        
        // Fetch events from API route
        const response = await fetch('/api/events?maxResults=20');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to load events');
        }
        
        // Parse dates (they come as strings from JSON)
        const parsedEvents = data.events.map((event: any) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime)
        }));
        
        setEvents(parsedEvents);
        
        // Get events for each category
        const categoryEvents: {[key: string]: CalendarEvent[]} = {};
        
        // For each category, filter events from the main list
        displayCategories.forEach(category => {
          const catEvents = parsedEvents.filter(
            (event: CalendarEvent) => event.category === category
          );
          
          categoryEvents[category] = catEvents;
        });
        
        setEventsByCategory(categoryEvents);
        
        // Set calendar URLs
        setCalendarUrl(data.calendarUrl);
        setEmbedUrl(data.embedUrl);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events. Please try again later.');
        setIsLoading(false);
      }
    }
    
    loadEvents();
  }, []);
  
  // Find featured event (first future event or first in the list)
  const featuredEvent = events.length > 0 ? events[0] : null;
  
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-gray-50">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-screen opacity-10 pointer-events-none">
        <div className="absolute top-32 right-0 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-24 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h5 className="text-primary uppercase tracking-wider font-medium mb-2">Stay Connected</h5>
          <h1 className="section-title">Events & Activities</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Join us for workshops, competitions, and networking events designed to enhance your civil engineering education and career prospects.
          </p>
        </div>
        
        {/* Featured Event Banner */}
        {featuredEvent ? (
          <div className="mb-16 relative overflow-hidden rounded-xl shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-90 z-10"></div>
            <div className="absolute inset-0">
              <img 
                src="/images/projects/09-01-23/IMG_0393-1.jpg" 
                alt="ASCE Event" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative z-20 p-8 md:p-12 text-white">
              <div className="inline-block bg-secondary text-primary font-bold px-4 py-2 rounded-full text-sm mb-4">
                FEATURED EVENT
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredEvent.title}</h2>
              <p className="text-xl mb-6 max-w-2xl">{featuredEvent.description.split('\n')[0]}</p>
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatEventDate(featuredEvent.startTime)}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{featuredEvent.location}</span>
                </div>
              </div>
              {featuredEvent.link && (
                <a 
                  href={featuredEvent.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Learn More
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-16 relative overflow-hidden rounded-xl shadow-lg bg-primary/10 p-12 text-center">
            <p className="text-xl">Stay tuned for our featured event</p>
          </div>
        )}
        
        {/* Calendar Integration */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-2 bg-sjsu-gradient"></div>
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Event Calendar
                  </h2>
                  <p className="text-gray-600">
                    Stay up-to-date with all our events by subscribing to our Google Calendar.
                  </p>
                </div>
                {calendarUrl && (
                  <a 
                    href={calendarUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-4 md:mt-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Subscribe to Calendar
                  </a>
                )}
              </div>
              
              {/* Google Calendar Embed */}
              <div className="rounded-lg overflow-hidden border border-gray-200">
                {embedUrl ? (
                  <iframe 
                    src={embedUrl}
                    style={{ border: 0 }} 
                    width="100%" 
                    height="400" 
                    frameBorder="0" 
                    scrolling="no"
                    title="SJSU ASCE Google Calendar"
                  ></iframe>
                ) : (
                  <div className="bg-gray-100 h-400 flex items-center justify-center p-10">
                    <p className="text-gray-500">Calendar loading or unavailable. Please check back later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Listings */}
        <div>
          {isLoading ? (
            <div className="text-center py-10">
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {displayCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-16">
                  <div className="flex items-center mb-6">
                    <span className="flex items-center justify-center w-12 h-12 bg-primary text-white rounded-lg mr-4">
                      {eventCategoryIcons[category as keyof typeof eventCategoryIcons]}
                    </span>
                    <h2 className="text-2xl font-bold">{category}</h2>
                  </div>
                  
                  {eventsByCategory[category]?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {eventsByCategory[category].map((event, eventIndex) => (
                        <div 
                          key={eventIndex} 
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 border-t-4 border-primary"
                        >
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-xl font-bold">{event.title}</h3>
                              <span className="inline-block bg-gray-100 text-primary text-sm font-semibold px-3 py-1 rounded">Upcoming</span>
                            </div>
                            
                            <div className="mb-4">
                              <div className="flex items-center text-gray-600 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{formatEventDate(event.startTime)}</span>
                              </div>
                              <div className="flex items-center text-gray-600 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatEventTime(event.startTime, event.endTime)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{event.location}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-6">{event.description.split('\n')[0]}</p>
                            
                            <div className="flex justify-between items-center">
                              {event.link && (
                                <a 
                                  href={event.link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary font-medium hover:text-primary-dark transition-colors"
                                >
                                  Add to calendar
                                </a>
                              )}
                              {event.link && (
                                <a 
                                  href={event.link}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-primary py-2"
                                >
                                  Details
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <p className="text-gray-500">No upcoming events in this category.</p>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
        
        {/* Past Events Photo Gallery - Add before Call to Action */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Past Events Gallery
          </h2>
          
          {socialPhotos.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-primary">Social Events</h3>
              <PhotoGallery 
                photos={socialPhotos.slice(0, 8)} 
                autoSlideInterval={5000}
                height="450px"
                showControls={true}
              />
            </div>
          )}
          
          {lunchLearnPhotos.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-primary">Lunch & Learn</h3>
              <PhotoGallery 
                photos={lunchLearnPhotos.slice(0, 8)} 
                autoSlideInterval={5000}
                height="450px"
                showControls={true}
              />
            </div>
          )}
          
          {tablingPhotos.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4 text-primary">Tabling Events</h3>
              <PhotoGallery 
                photos={tablingPhotos.slice(0, 8)} 
                autoSlideInterval={5000}
                height="450px"
                showControls={true}
              />
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link 
              href="/gallery" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors duration-300"
            >
              View Full Photo Gallery
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="bg-sjsu-gradient text-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to organize an event?</h2>
              <p className="mb-6">
                SJSU ASCE members can propose and organize events relevant to civil engineering students. Contact our events coordinator to discuss your idea.
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Contact Us
              </Link>
            </div>
            <div className="relative min-h-[200px] md:min-h-full">
              <img 
                src="/images/projects/09-01-23/IMG_0381-1.jpg" 
                alt="ASCE Event Proposal" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 