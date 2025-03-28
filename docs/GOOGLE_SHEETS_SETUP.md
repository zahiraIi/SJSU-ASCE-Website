# Google Sheets Integration Setup

This document explains how to set up the Google Sheets integration for the contact form.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Google Sheets API

## Step 2: Create a Service Account

1. In your Google Cloud Project, go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name your service account (e.g., "contact-form-handler")
4. Grant the role "Editor" to the service account
5. Click "Create Key" and select JSON as the key type
6. Save the downloaded JSON file securely

## Step 3: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Rename the first sheet to "ContactForm"
3. Add the following headers to the first row:
   - Timestamp
   - Name
   - Email
   - Message
4. Share the spreadsheet with the service account email (found in the JSON file) with Editor permissions

## Step 4: Update Environment Variables

1. Open the `.env.local` file in the project root
2. Update the following variables with values from your JSON key file and the spreadsheet:
   - `GOOGLE_SHEETS_CLIENT_EMAIL`: The `client_email` from the JSON file
   - `GOOGLE_SHEETS_PRIVATE_KEY`: The `private_key` from the JSON file
   - `GOOGLE_SHEETS_SPREADSHEET_ID`: The ID of your spreadsheet (found in the URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`)

## Testing the Integration

After completing the setup:

1. Submit a test form on the contact page
2. Verify that the data appears in your Google Sheet

## Troubleshooting

- If you encounter errors, check the console logs in your browser and server
- Ensure the service account has Editor access to the spreadsheet
- Verify that all environment variables are correctly set
- Make sure the Google Sheets API is enabled in your Google Cloud Project 