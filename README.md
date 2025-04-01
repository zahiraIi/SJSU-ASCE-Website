# SJSU ASCE Website

This is the official website for the American Society of Civil Engineers (ASCE) chapter at San Jose State University.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

The following scripts are available:

- `npm run dev`: Starts the development server
- `npm run build`: Builds the app for production
- `npm run start`: Runs the built app in production mode
- `npm run lint`: Runs ESLint to check for code issues
- `npm run download-logos`: Downloads logos for sponsors from their websites
- `npm run create-placeholders`: Creates placeholder SVGs for sponsors without logos
- `npm run fetch-companies`: Attempts to fetch company data from Google Sheet and updates sponsors data (requires proper Google API setup)
- `npm run fetch-companies-simple`: Updates sponsors with hardcoded company data from the spreadsheet (more reliable option)
- `npm run fetch-companies-enhanced`: Focuses on finding logos for specific companies with missing logos using advanced search techniques

## Sponsor Management

The website includes a sponsors page that displays company logos in both a scrolling animation and a grid layout. To update the sponsors:

1. Use `npm run fetch-companies-simple` to update the sponsors with the latest company information.
2. This will automatically download logos using the Clearbit Logo API and create placeholder images for companies that don't have logos available.
3. The script will then update the sponsors data in `app/sponsors/page.tsx` with the refreshed information.

For specific companies with missing logos, you can use the enhanced script:

1. Use `npm run fetch-companies-enhanced` to target specific companies that need better logos.
2. This script employs multiple advanced logo search strategies:
   - Checks manual curated logo URLs first for higher quality logos
   - Uses the Clearbit Logo API with company domains and name variations
   - Searches for regional terms (San Jose, Bay Area, etc.) to find appropriate logos
   - Attempts to find logos by directly scraping company websites
   - Creates custom placeholders when no logo can be found
3. The script has special handling for specific companies like PASE, Graniterock, Technical Builders, Whiting-Turner, and XL Construction.
4. To add more companies to target, edit the `targetCompanies` array in `scripts/fetch-companies-enhanced.js`.

## Google Calendar Integration

To set up the Google Calendar integration for displaying events:

1. Follow the instructions in `docs/GOOGLE_CALENDAR_SETUP.md`
2. Create a Google Calendar and make it public
3. Set up a Google Cloud Project and enable the Google Calendar API
4. Generate an API key
5. Update the `.env.local` file with your Calendar ID and API key:

```
NEXT_PUBLIC_GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY=your-api-key
```

Without proper configuration, the website will display sample placeholder events.

## Google Drive Image Integration

The website uses Google Drive to host images instead of storing them in the repository. This keeps the Git repository small while maintaining the same file path references in the code.

**How it works:**
1. Images are stored in a Google Drive folder
2. Components reference images with standard paths (e.g., `/images/photos/event.jpg`)
3. The `imageUtils.ts` utility maps these paths to Google Drive file IDs
4. Images are served directly from Google Drive

For detailed setup and usage instructions, see [Google Drive Images Documentation](docs/GOOGLE_DRIVE_IMAGES.md).

To test the image loading system, visit `/image-test` in the running application.

## Backblaze B2 Image Integration

This project uses Backblaze B2 Cloud Storage for hosting images, with multiple methods of integration to ensure reliable image loading.

### Configuration

The B2 integration is configured with these environment variables, which can be set in your `.env.local` file:

```
NEXT_PUBLIC_USE_B2_STORAGE=true
NEXT_PUBLIC_B2_BUCKET_NAME=ascewebsiteimages
NEXT_PUBLIC_B2_KEY_ID=your_key_id
NEXT_PUBLIC_B2_APPLICATION_KEY=your_application_key
```

### How It Works

We've implemented two approaches to ensure reliable image loading:

1. **API Route Method (Recommended)**: Uses a server-side API route to proxy image requests, handling authentication and ensuring proper content types. This method provides the most reliable experience.

2. **Direct URL Method**: As a fallback, direct URLs to the B2 bucket can be used for simple public access.

### Using the BackblazeImage Component

```jsx
import BackblazeImage from '@/components/BackblazeImage';

<BackblazeImage 
  path="path/to/image.jpg" 
  alt="Description of image" 
  width={500} 
  height={300} 
/>
```

### Troubleshooting

If images fail to load:

1. **Check Bucket Permissions**: Ensure your B2 bucket is set to "Public"
2. **CORS Configuration**: Add proper CORS rules to your bucket
3. **Content Types**: Make sure your images have proper content types when uploaded

### CORS Configuration

Use this CORS configuration in your Backblaze B2 bucket:

```json
{
  "corsRules": [
    {
      "corsRuleName": "allow-web-access",
      "allowedOrigins": ["*"],
      "allowedOperations": ["s3_head", "s3_get", "b2_download_file_by_id", "b2_download_file_by_name"],
      "allowedHeaders": ["*"],
      "maxAgeSeconds": 3600
    }
  ]
}
```

To set this using the B2 CLI:

```bash
b2 bucket update --corsRule '{
  "corsRuleName": "allow-web-access",
  "allowedOrigins": ["*"], 
  "allowedOperations": ["s3_head", "s3_get", "b2_download_file_by_id", "b2_download_file_by_name"], 
  "allowedHeaders": ["*"], 
  "maxAgeSeconds": 3600
}' ascewebsiteimages allPublic
```

## Features

- **Modern Design**: Built with Next.js and TailwindCSS
- **Responsive Layout**: Optimized for all device sizes
- **Image Hosting**: Images stored on Backblaze B2 for reliable delivery
- **Google Calendar Integration**: Display upcoming events from the ASCE calendar
- Responsive design for all screen sizes
- Dynamic homepage with services and project showcases
- Sponsors page with scrolling animation and grid display
- Membership information with direct application link
- Competitions and activities showcase
- Projects showcase
- Contact form

## Configuration

This project uses environment variables for configuration. Create a `.env.local` file in the root directory with the following variables:

```
# Backblaze B2 Configuration
NEXT_PUBLIC_USE_B2_STORAGE=true
NEXT_PUBLIC_B2_BUCKET_URL=https://f004.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=

# Google Calendar Configuration
GOOGLE_CALENDAR_API_KEY=your_api_key_here
GOOGLE_CALENDAR_ID=your_calendar_id_here
```

## Image Handling

Images are stored in Backblaze B2 Cloud Storage for reliable delivery with proper content-type headers. See [Backblaze B2 Images Documentation](./docs/BACKBLAZE_B2_IMAGES.md) for details on usage and implementation.

## Development

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up your environment variables in `.env.local`
4. Run the development server with `npm run dev`

## Deployment

This site can be deployed to any platform that supports Next.js, such as Vercel or Netlify.

1. Connect your repository to your hosting platform
2. Configure the environment variables in your hosting platform's dashboard
3. Deploy the site

## License

[MIT](LICENSE)

## Built With

- [Next.js](https://nextjs.org/) - The React framework
- [React](https://reactjs.org/) - Frontend library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types 

## Running with Cloudflare R2 Storage via Wrangler

To serve images from your Cloudflare R2 bucket during local development:

1. **Authenticate with Cloudflare** (only need to do this once):
   ```bash
   npm run wrangler-login
   ```
   This will open a browser window to authorize Wrangler to access your Cloudflare account.

2. **Start the development environment with R2 worker**:
   ```bash
   npm run dev:with-r2
   ```
   This will start both the Next.js development server and the Wrangler worker that serves content from your R2 bucket.

3. **Test the R2 worker**:
   Visit http://localhost:3000/r2-worker-test to verify that the Wrangler worker is correctly serving content from your R2 bucket.

4. **If you encounter issues**:
   - Check that your `.env.local` file has the correct R2 credentials
   - Verify that your `wrangler.toml` has the correct account ID and bucket name
   - Make sure you've authenticated with Cloudflare
   - Look at the terminal output from Wrangler for any error messages

### Running Just the Wrangler Worker

If you want to run only the Wrangler worker for testing:
```bash
npm run r2-worker
```

This will start the worker on http://localhost:8787. You can access files directly at http://localhost:8787/path/to/file.jpg. 