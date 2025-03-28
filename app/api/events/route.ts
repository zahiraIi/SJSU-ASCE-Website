import { NextResponse } from 'next/server';
import { 
  getUpcomingEvents, 
  getEventsByCategory, 
  getCalendarSubscriptionUrl, 
  getCalendarEmbedUrl 
} from '../../utils/googleCalendar';

// This is a server-side API route
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const maxResults = parseInt(url.searchParams.get('maxResults') || '10', 10);
    
    // Get calendar URLs
    const calendarUrl = await getCalendarSubscriptionUrl();
    const embedUrl = await getCalendarEmbedUrl();
    
    let events;
    if (category) {
      // Get events for a specific category
      events = await getEventsByCategory(category, maxResults);
    } else {
      // Get all upcoming events
      events = await getUpcomingEvents(maxResults);
    }
    
    return NextResponse.json({
      success: true,
      events,
      calendarUrl,
      embedUrl
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 