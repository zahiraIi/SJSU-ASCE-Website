# SJSU ASCE Website

<div align="center">
  <a href="https://sjsu-asce-website.vercel.app">
    <img src="public/possiblefrontpage.JPG" alt="SJSU ASCE Team" width="700">
  </a>
  <p><em>Building the future of civil engineering through innovation, collaboration, and leadership</em></p>
</div>

This is the official website for the American Society of Civil Engineers (ASCE) chapter at San Jose State University. The website showcases our organization, events, projects, and provides resources for students interested in civil engineering.

<div align="center">
  <a href="https://sjsu-asce-website.vercel.app">
    <img src="https://img.shields.io/badge/Visit-Live%20Website-blue?style=for-the-badge&logo=globe" alt="View Live Website">
  </a>
</div>

## 📌 Table of Contents
- [🧑‍💼 For Website Administrators](#-for-website-administrators)
  - [📸 Updating Photos](#-updating-photos)
  - [📅 Managing the Calendar](#-managing-the-calendar)
  - [📨 Contact Form Information](#-contact-form-information)
- [👩‍💻 For Developers](#-for-developers)
  - [🚀 Getting Started](#-getting-started)
  - [🏗️ Project Structure](#-project-structure)
  - [⚙️ Technologies Used](#-technologies-used)
  - [🚢 Deployment](#-deployment)

---

## 🧑‍💼 For Website Administrators

This section provides instructions for non-technical users who need to update content on the website.

### 📸 Updating Photos

The website uses Cloudflare R2 Cloud Storage for storing and serving images. To update photos:

#### ✨ Through the Cloudflare R2 Web Interface (Recommended for non-technical users)

1. **Log in to the Cloudflare R2 account**:
   - 🔐 Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 🔑 Use the ASCE account credentials (contact the webmaster if you don't have access)

2. **Navigate to the bucket**:
   - 📁 Click on "R2" in the left sidebar
   - 🗂️ Select the "ascewebsiteimages" bucket

3. **Upload new images**:
   - ⬆️ Click the "Upload" button
   - 🖼️ Select files from your computer
   - 📋 Maintain the folder structure when uploading:
     - Event photos go in: `FGM Pics/` or appropriate event folder
     - Officer photos go in: `officers/`
     - General photos go in: `photos/`

4. **Important notes**:
   - DO NOT EXCEED THE 10GB SPACE IN THE FOLDER (OR ELSE WILL BE CHARGED MONEY --> DELETE OLD FILES IF NECCESARY)
   - 📝 Image files should be in JPG or PNG format
   - 📊 Keep file sizes under 1MB (compress large images before uploading)
   - 🏷️ Use simple file names without spaces or special characters
   - ⚡ Images will appear on the website shortly after uploading

### 📅 Managing the Calendar

The website displays events from a Google Calendar. To update events:

1. **Access the Google Calendar**:
   - 🌐 Go to [Google Calendar](https://calendar.google.com)
   - 🔐 Sign in with the SJSU ASCE account credentials

2. **Add or edit events**:
   - ➕ Click on the date for a new event, or click an existing event to edit
   - 📝 Fill in the event details:
     - Title: Clear, concise name of the event
     - Date and time: When the event will occur
     - Location: Physical location or Zoom link
     - Description: Add details about the event

3. **Categorize your event** (important for website display):
   - 🏷️ In the event description, add a line: `Category: [CATEGORY_NAME]`
   - 📋 Example: `Category: Workshops & Training`
   - 📊 Available categories:
     - Workshops & Training
     - Competitions
     - Networking Events
     - General

4. **Add an image** (optional):
   - 🖼️ In the event description, add a line: `ImagePath: path/to/image.jpg`
   - 📋 Example: `ImagePath: events/workshop_spring_2023.jpg`
   - ⚠️ Make sure to upload this image to Cloudflare R2 first

5. **Changes will be reflected on the website automatically** (might take a few minutes) ⏱️

### 📨 Contact Form Information

When visitors submit the contact form, their information is stored in a database. To access this information:

1. **Check the contact submissions**:
   - 📧 Contact form submissions are forwarded to the SJSU ASCE email account
   - 🔐 Sign in to your ASCE Gmail account to view submissions
   - 📑 Submissions will have the subject line "New Contact Form Submission"

2. **Export submissions** (if needed):
   - 📊 For a record of all submissions, contact the website administrator
   - 📥 Data can be exported to Excel/CSV format upon request

---

## 👩‍💻 For Developers

This section is for technical users who need to maintain or extend the website codebase.

### 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/sjsuasce/website.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### 🏗️ Project Structure

```
/app                        # Next.js app directory (main application code)
  /api                      # API routes
    /contact                # Contact form API endpoint
    /events                 # Events API routes
  /components               # Reusable components
    /Layout                 # Layout components (header, footer, etc.)
    /ui                     # UI components (buttons, cards, etc.)
    /R2Image.tsx            # Cloudflare R2 image component
    /FallbackImage.tsx      # Fallback image component
    /PhotoGallery.tsx       # Photo gallery component
    /UpcomingEvents.tsx     # Upcoming events component
  /about                    # About page
  /contact                  # Contact page
  /events                   # Events page
  /gallery                  # Gallery page
  /membership               # Membership page
  /officers                 # Officers page
  /sponsors                 # Sponsors page
  /hooks                    # Custom React hooks
  /utils                    # Utility functions
    /googleCalendar.ts      # Google Calendar integration
    /imageUtils.ts          # Image utility functions
    /photoData.ts           # Photo data functions
  /page.tsx                 # Homepage
  /layout.tsx               # Root layout
  /globals.css              # Global CSS styles
/docs                       # Documentation
  /GOOGLE_CALENDAR_SETUP.md # Google Calendar setup guide
  /CLOUDFLARE_R2_STORAGE.md # Cloudflare R2 storage guide
/public                     # Static assets
/scripts                    # Utility scripts for maintenance tasks
/types                      # TypeScript type definitions
/next.config.js             # Next.js configuration
/tailwind.config.js         # Tailwind CSS configuration
/r2-worker.js               # Cloudflare R2 worker script
/wrangler.toml              # Wrangler configuration for Cloudflare
```

### ⚙️ Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Image Storage**: Cloudflare R2
- **Calendar Integration**: Google Calendar API
- **Deployment**: Vercel

### 🚢 Deployment

The site is automatically deployed through Vercel when changes are pushed to the main branch. Manual deployments can be triggered from the Vercel dashboard.

For detailed development documentation, please refer to the files in the `/docs` directory:
- [Google Calendar Setup](docs/GOOGLE_CALENDAR_SETUP.md)
- [Cloudflare R2 Storage](docs/CLOUDFLARE_R2_STORAGE.md)

---

## 📄 License

[MIT](LICENSE)

## 📞 Contact

For questions or support regarding the website, please contact the SJSU ASCE webmaster at [web@sjsuasce.com](mailto:web@sjsuasce.com). 