import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

// Environment variables (ensure these are set in .env.local)
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
const SHEET_NAME = 'Sheet1';
const CLIENT_EMAIL = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
// Correctly format the private key, replacing literal \n with actual newlines
const PRIVATE_KEY = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Check essential configuration
if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
  console.error("Google Sheets API configuration is missing in .env.local");
  // We won't throw here to avoid crashing the server during build/startup
  // but requests to this API will fail.
}

export async function POST(req: NextRequest) {
  // Check configuration again at runtime
  if (!SPREADSHEET_ID || !CLIENT_EMAIL || !PRIVATE_KEY) {
    console.error("Config check failed runtime: ID:", SPREADSHEET_ID, "Email:", !!CLIENT_EMAIL, "Key:", !!PRIVATE_KEY);
    return NextResponse.json({ success: false, error: 'Google Sheets API not configured on server.' }, { status: 500 });
  }

  // Log the values being used just before the try block
  console.log("Attempting Google Sheets Append with:");
  console.log("  Spreadsheet ID:", SPREADSHEET_ID);
  console.log("  Sheet Name:", SHEET_NAME);

  try {
    const body = await req.json();
    const { name, email, message, agreement } = body;

    // Basic validation - check for agreement as well
    if (!name || !email || !message || agreement === undefined) { // Check if agreement exists
      return NextResponse.json({ success: false, error: 'Missing required form fields.' }, { status: 400 });
    }

    // Validate agreement is a boolean
    if (typeof agreement !== 'boolean') {
         return NextResponse.json({ success: false, error: 'Invalid agreement value.' }, { status: 400 });
    }

    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Prepare data row (Name, Email, Message, Agreement)
    const newRow = [name, email, message, String(agreement)];

    // Append data to the sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED', // Interpret data as if the user typed it
      requestBody: {
        values: [newRow],
      },
    });

    if (response.status === 200) {
      return NextResponse.json({ success: true });
    } else {
      console.error('Google Sheets API Error:', response.status, response.statusText, response.data);
      return NextResponse.json({ success: false, error: 'Failed to submit form to Google Sheets.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Contact form API error:', error);
    if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred.' }, { status: 500 });
  }
} 