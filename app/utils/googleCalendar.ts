'use server';

import { google } from 'googleapis';

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  category?: string;
  link?: string;
  imagePath?: string;
}

// Configure calendar settings
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || '';

// Check if Google Calendar is configured
const isCalendarConfigured = !!(CALENDAR_ID && API_KEY);

// Map Google Calendar event to our application event format
function mapGoogleEventToCalendarEvent(event: any): CalendarEvent {
  // Default category
  let category = 'General';
  let imagePath: string | undefined = undefined;
  
  // 1. Check for explicit category in description
  if (event.description) {
    const categoryMatch = event.description.match(/Category:\s*([^,\n]+)/i);
    if (categoryMatch && categoryMatch[1]) {
      category = categoryMatch[1].trim();
    }

    // Check for explicit image path in description
    const imagePathMatch = event.description.match(/ImagePath:\s*([^\n]+)/i);
    if (imagePathMatch && imagePathMatch[1]) {
      imagePath = imagePathMatch[1].trim();
    }
  }

  // 2. If no explicit category, check title for keywords (only if category is still 'General')
  if (category === 'General' && event.summary) {
    const title = event.summary.toLowerCase();
    if (title.includes('workshop') || title.includes('training')) {
      category = 'Workshops & Training';
    } else if (title.includes('competition')) {
      category = 'Competitions';
    } else if (title.includes('networking')) {
      category = 'Networking Events';
    } else if (title.includes('meeting')) {
      category = 'Meetings'; // Or keep as General if preferred
    } else if (title.includes('social')) {
      category = 'Social Events'; // Or keep as General if preferred
    }
    // Add more keyword checks as needed
  }

  // 3. Could add fallback to event colorId mapping here if desired

  return {
    id: event.id,
    title: event.summary || 'Untitled Event',
    description: event.description || '',
    location: event.location || '',
    startTime: new Date(event.start.dateTime || event.start.date),
    endTime: new Date(event.end.dateTime || event.end.date),
    category: category, // Use the determined category
    link: event.htmlLink || '',
    imagePath: imagePath
  };
}

// Function to fetch all upcoming events
export async function getUpcomingEvents(maxResults = 10): Promise<CalendarEvent[]> {
  if (!isCalendarConfigured) {
    console.warn('Google Calendar is not configured. Set up your API keys in .env.local');
    // Return sample events for development
    return getSampleEvents();
  }

  try {
    const calendar = google.calendar({
      version: 'v3',
      auth: API_KEY
    });

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    return events.map(mapGoogleEventToCalendarEvent);
  } catch (error) {
    console.error('Error fetching events from Google Calendar:', error);
    // Return sample events in case of API errors
    return getSampleEvents();
  }
}

// Function to fetch events by category
export async function getEventsByCategory(category: string, maxResults = 10): Promise<CalendarEvent[]> {
  const allEvents = await getUpcomingEvents(50); // Get a larger pool of events
  return allEvents
    .filter(event => event.category?.toLowerCase() === category.toLowerCase())
    .slice(0, maxResults);
}

// Function to fetch a single event by ID
export async function getEventById(eventId: string): Promise<CalendarEvent | null> {
  if (!isCalendarConfigured) {
    console.warn('Google Calendar is not configured. Set up your API keys in .env.local');
    // Return a sample event for development
    const sampleEvents = getSampleEvents();
    return sampleEvents.find(event => event.id === eventId) || sampleEvents[0];
  }

  try {
    const calendar = google.calendar({
      version: 'v3',
      auth: API_KEY
    });

    const response = await calendar.events.get({
      calendarId: CALENDAR_ID,
      eventId: eventId
    });

    const event = response.data;
    return mapGoogleEventToCalendarEvent(event);
  } catch (error) {
    console.error('Error fetching event from Google Calendar:', error);
    return null;
  }
}

// Function to get events by date range
export async function getEventsByDateRange(
  start: Date, 
  end: Date, 
  maxResults = 100
): Promise<CalendarEvent[]> {
  if (!isCalendarConfigured) {
    console.warn('Google Calendar is not configured. Set up your API keys in .env.local');
    return getSampleEvents();
  }

  try {
    const calendar = google.calendar({
      version: 'v3',
      auth: API_KEY
    });

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: maxResults,
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    return events.map(mapGoogleEventToCalendarEvent);
  } catch (error) {
    console.error('Error fetching events from Google Calendar:', error);
    return getSampleEvents();
  }
}

// Generate calendar subscription URL
export async function getCalendarSubscriptionUrl(): Promise<string> {
  if (!CALENDAR_ID) {
    return '#';
  }
  
  // Encode the calendar ID for use in URL
  const encodedCalendarId = encodeURIComponent(CALENDAR_ID);
  return `https://calendar.google.com/calendar/render?cid=${encodedCalendarId}`;
}

// Generate calendar embedding URL
export async function getCalendarEmbedUrl(): Promise<string> {
  if (!CALENDAR_ID) {
    return '#';
  }
  
  // Encode the calendar ID for use in URL
  const encodedCalendarId = encodeURIComponent(CALENDAR_ID);
  return `https://calendar.google.com/calendar/embed?src=${encodedCalendarId}&ctz=America%2FLos_Angeles`;
}

// Generate sample events for development when Calendar API is not configured
function getSampleEvents(): CalendarEvent[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const twoWeeks = new Date(today);
  twoWeeks.setDate(twoWeeks.getDate() + 14);
  
  return [
    {
      id: 'sample-event-1',
      title: 'Sample Workshop Event',
      description: 'This is a sample event for development. When you configure the Google Calendar API, this will be replaced with real events.',
      location: 'Engineering Building, SJSU Campus',
      startTime: tomorrow,
      endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
      category: 'Workshops & Training',
      link: '#',
    },
    {
      id: 'sample-event-2',
      title: 'Sample Competition Event',
      description: 'This is a sample competition event. Configure your Google Calendar API to see real events.',
      location: 'Student Union, SJSU Campus',
      startTime: nextWeek,
      endTime: new Date(nextWeek.getTime() + 3 * 60 * 60 * 1000), // 3 hours later
      category: 'Competitions',
      link: '#',
    },
    {
      id: 'sample-event-3',
      title: 'Sample Networking Event',
      description: 'This is a sample networking event for development purposes.',
      location: 'Virtual (Zoom)',
      startTime: twoWeeks,
      endTime: new Date(twoWeeks.getTime() + 1.5 * 60 * 60 * 1000), // 1.5 hours later
      category: 'Networking Events',
      link: '#',
    },
  ];
} 