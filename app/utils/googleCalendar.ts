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
}

// Configure calendar settings
const CALENDAR_ID = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || '';
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY || '';

// Map Google Calendar event to our application event format
function mapGoogleEventToCalendarEvent(event: any): CalendarEvent {
  // Extract the event category from the description or color
  let category = 'General';
  if (event.description) {
    const categoryMatch = event.description.match(/Category:\s*([^,\n]+)/i);
    if (categoryMatch && categoryMatch[1]) {
      category = categoryMatch[1].trim();
    }
  }

  return {
    id: event.id,
    title: event.summary || 'Untitled Event',
    description: event.description || '',
    location: event.location || '',
    startTime: new Date(event.start.dateTime || event.start.date),
    endTime: new Date(event.end.dateTime || event.end.date),
    category: category,
    link: event.htmlLink || ''
  };
}

// Function to fetch all upcoming events
export async function getUpcomingEvents(maxResults = 10): Promise<CalendarEvent[]> {
  if (!CALENDAR_ID || !API_KEY) {
    console.error('Google Calendar ID or API Key is missing');
    return [];
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
    return [];
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
  if (!CALENDAR_ID || !API_KEY) {
    console.error('Google Calendar ID or API Key is missing');
    return null;
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
  if (!CALENDAR_ID || !API_KEY) {
    console.error('Google Calendar ID or API Key is missing');
    return [];
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
    return [];
  }
}

// Generate calendar subscription URL
export async function getCalendarSubscriptionUrl(): Promise<string> {
  if (!CALENDAR_ID) {
    return '';
  }
  
  // Encode the calendar ID for use in URL
  const encodedCalendarId = encodeURIComponent(CALENDAR_ID);
  return `https://calendar.google.com/calendar/render?cid=${encodedCalendarId}`;
}

// Generate calendar embedding URL
export async function getCalendarEmbedUrl(): Promise<string> {
  if (!CALENDAR_ID) {
    return '';
  }
  
  // Encode the calendar ID for use in URL
  const encodedCalendarId = encodeURIComponent(CALENDAR_ID);
  return `https://calendar.google.com/calendar/embed?src=${encodedCalendarId}&ctz=America%2FLos_Angeles`;
} 