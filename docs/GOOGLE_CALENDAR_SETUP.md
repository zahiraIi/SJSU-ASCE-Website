# Google Calendar Integration Setup Guide

This guide explains how to set up and configure Google Calendar integration for the SJSU ASCE website, ensuring that all events on the site are automatically synchronized with a Google Calendar.

## Table of Contents

1. [Create a Google Calendar](#1-create-a-google-calendar)
2. [Make the Calendar Public](#2-make-the-calendar-public)
3. [Set Up Google Cloud Project](#3-set-up-google-cloud-project)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Event Categories](#5-event-categories)
6. [Managing Events](#6-managing-events)
7. [Troubleshooting](#7-troubleshooting)

## 1. Create a Google Calendar

First, you need to create a dedicated Google Calendar for SJSU ASCE events:

1. Go to [Google Calendar](https://calendar.google.com)
2. Sign in with the Google account you want to use for SJSU ASCE events
3. On the left side, click the "+" button next to "Other calendars"
4. Select "Create new calendar"
5. Fill in the details:
   - Name: "SJSU ASCE Events"
   - Description: "Official calendar for San Jose State University ASCE Chapter events"
   - Time zone: Select "America/Los_Angeles" or your local time zone
6. Click "Create calendar"

## 2. Make the Calendar Public

To allow the website to read calendar information and to allow users to subscribe:

1. In Google Calendar, find your newly created calendar in the left sidebar
2. Click the three dots next to the calendar name and select "Settings and sharing"
3. Scroll down to "Access permissions"
4. Check "Make available to public"
5. Make sure "See all event details" is selected
6. Under "Integrate calendar", copy the "Calendar ID" - you'll need this later
7. Also note the "Public URL to this calendar" - you can share this link directly with members

## 3. Set Up Google Cloud Project

You need to create a Google Cloud project and API key to access the calendar:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. From the navigation menu, select "APIs & Services" > "Library"
4. Search for "Google Calendar API" and enable it
5. Go to "APIs & Services" > "Credentials"
6. Click "Create Credentials" and select "API key"
7. Copy the generated API key
8. (Optional but recommended) Restrict the API key:
   - Click on the newly created API key
   - Under "API restrictions", select "Restrict key"
   - Select "Google Calendar API" from the dropdown
   - Under "Application restrictions", consider limiting to your website domains
   - Save changes

## 4. Configure Environment Variables

Update the `.env.local` file in the project root:

1. Open the `.env.local` file
2. Add or update the following variables:
   ```
   NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
   NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your-api-key
   ```
3. Replace `your-calendar-id@group.calendar.google.com` with the Calendar ID you copied earlier
4. Replace `your-api-key` with the API key you generated in Google Cloud Console

## 5. Event Categories

The website groups events into categories. To assign a category to an event in Google Calendar:

1. When creating or editing an event, add a line to the description:
   ```
   Category: [CATEGORY_NAME]
   ```
   
   For example:
   ```
   Join us for this workshop to learn AutoCAD!
   
   Category: Workshops & Training
   ```

2. The supported categories are:
   - Workshops & Training
   - Competitions
   - Networking Events
   - General

If no category is specified, events will default to the "General" category.

## 6. Managing Events

### Creating Events

When creating events in Google Calendar:

1. Use a clear, concise title
2. Include a detailed description
3. Specify the category as described above
4. Add the location information
5. Set the correct start and end times
6. Consider adding a Google Meet link for virtual events

### Featured Events

The first upcoming event is automatically featured on the website. To ensure a specific event is featured:

1. Schedule it as the next upcoming event, or
2. For important events, consider temporarily rescheduling other events

### All-Day Events

For all-day events like conferences:

1. When creating the event, check the "All day" option
2. The website will automatically display these as "All day" events

## 7. Troubleshooting

If events are not appearing on the website:

1. **Check API Key**: Verify that the API key is correctly entered in the `.env.local` file
2. **Check Calendar ID**: Verify that the Calendar ID is correct
3. **Public Settings**: Ensure the calendar is set to public
4. **API Enabled**: Make sure the Google Calendar API is enabled in your Google Cloud project
5. **API Quota**: Check if you've exceeded API quota limits
6. **Event Categories**: If events aren't appearing in specific categories, check the category text in the event description
7. **Cache**: The website may cache events for performance reasons; allow time for updates to propagate

## Additional Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Google Cloud Console](https://console.cloud.google.com/)
- Contact the SJSU ASCE webmaster for specific help with the website integration 