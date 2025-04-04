# SJSU ASCE Website: User Guide

<div align="center">
  <img src="https://r2.sjsuasce.com/ASCELOGO/ASCE.png" alt="SJSU ASCE Logo" width="200">
</div>

## Introduction

This guide provides simple instructions for managing content on the SJSU ASCE website. It's designed for non-technical users who need to update photos, calendar events, and access form submissions.

## Table of Contents
- [Updating Photos](#updating-photos)
- [Managing Calendar Events](#managing-calendar-events)
- [Accessing Contact Form Submissions](#accessing-contact-form-submissions)
- [Getting Help](#getting-help)

## Updating Photos

### Step 1: Log into Cloudflare R2
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Enter the ASCE account email and password
   - If you don't have these credentials, contact the website administrator

### Step 2: Navigate to the Image Bucket
1. From the dashboard, click on "R2" in the left sidebar
2. Click on the "ascewebsiteimages" bucket

### Step 3: Upload New Images
1. Click the blue "Upload" button
2. Select files from your computer
3. Important: Put photos in the correct folders
   - Event photos: `FGM Pics/` folder
   - Officer photos: `officers/` folder
   - General photos: `photos/` folder

### Step 4: Best Practices
- Use JPG or PNG format
- Keep file sizes under 1MB (compress large images before uploading)
- Use simple file names without spaces or special characters
- Images will appear on the website immediately after upload

## Managing Calendar Events

### Step 1: Access Google Calendar
1. Go to [Google Calendar](https://calendar.google.com)
2. Sign in with the SJSU ASCE Google account

### Step 2: Add or Edit Events
1. Click on a date to create a new event
2. Fill out the event details:
   - Title: Name of the event
   - Date/Time: When the event occurs
   - Location: Where the event takes place (or Zoom link)
   - Description: Details about the event

### Step 3: Categorize Your Event
In the event description, add this special text:
```
Category: Workshops & Training
```

Use one of these categories:
- Workshops & Training
- Competitions
- Networking Events
- General

### Step 4: Add an Image (Optional)
In the event description, add:
```
ImagePath: events/your-image-name.jpg
```
Make sure to upload this image to Cloudflare R2 first!

### Step 5: Save the Event
Click "Save" and the event will automatically appear on the website within a few minutes.

## Accessing Contact Form Submissions

### Where to Find Submissions
Contact form submissions are automatically sent to the SJSU ASCE email inbox:

1. Log into the ASCE Gmail account
2. Look for emails with the subject "New Contact Form Submission"
3. Each email contains the submitted information:
   - Name
   - Email
   - Message
   - Submission date

### Exporting Submissions
If you need all submissions in a spreadsheet format:
1. Contact the website administrator
2. Request an export of the contact form database
3. You'll receive an Excel file with all submissions

## Getting Help

If you have trouble with any of these tasks, or need additional help:

- **Email**: Contact the website administrator at [web@sjsuasce.com](mailto:web@sjsuasce.com)
- **Meeting**: Schedule a quick call or meeting for a walkthrough
- **Documentation**: Refer to the full README.md file in the project repository

---

Last updated: April 2024 