'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setIsLoading(true);
        // Fetch events from API route
        const response = await fetch('/api/events?maxResults=3');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to load events');
        }
        
        // Parse dates (they come as strings from JSON)
        const parsedEvents = data.events.map((event: any) => ({
          id: event.id,
          title: event.title,
          startTime: new Date(event.startTime)
        }));
        
        setEvents(parsedEvents);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Failed to load events');
        setIsLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  // Format date in MMM DD format (e.g., APR 20)
  const formatEventDate = (date: Date) => {
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
  };

  return (
    <div className="glass-card rounded-lg p-6 sm:p-8 shadow-xl">
      <h3 className="text-white font-bold text-lg sm:text-xl mb-3 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        Upcoming Events
      </h3>
      
      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-12 bg-white/20 rounded"></div>
          <div className="h-12 bg-white/20 rounded"></div>
        </div>
      ) : error ? (
        <p className="text-white/80 p-2 rounded">Unable to load events</p>
      ) : events.length === 0 ? (
        <p className="text-white/80 p-2 rounded">No upcoming events</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="text-white/80 p-2 rounded">
              <span className="block text-sm font-medium text-blue-300">
                {formatEventDate(event.startTime)}
              </span>
              <span className="block">{event.title}</span>
            </li>
          ))}
        </ul>
      )}
      
      <Link 
        href="/events" 
        className="inline-flex items-center text-sm text-blue-300 hover:text-blue-200 mt-4"
      >
        View all events
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </Link>
    </div>
  );
} 