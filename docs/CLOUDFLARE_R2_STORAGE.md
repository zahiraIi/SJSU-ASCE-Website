# Using Cloudflare R2 Storage for Images

This project uses Cloudflare R2 Storage for hosting images. This document explains how to set up and use Cloudflare R2 for this application.

## Why Cloudflare R2?

Cloudflare R2 offers several advantages for image hosting:

1. **Cost-Effective**: No egress fees, unlike AWS S3 and other cloud storage providers
2. **Global Performance**: Leverages Cloudflare's global network for fast delivery
3. **S3 Compatible API**: Works with existing S3 tools and libraries
4. **Simple Integration**: Easy to integrate with web applications
5. **Public Buckets**: Option to make buckets public without complex configurations

## Setting Up Cloudflare R2

### 1. Create a Cloudflare Account

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up) if you don't have one
2. Activate R2 in your Cloudflare dashboard

### 2. Create an R2 Bucket

1. Navigate to R2 in your Cloudflare dashboard
2. Click "Create bucket" and name it (e.g., "asce-images")
3. Choose your settings (public or private access)

### 3. Create API Tokens

1. In R2, go to "Manage R2 API Tokens"
2. Create a new API token with read access to your bucket
3. Save your Account ID, Access Key ID, and Secret Access Key

### 4. Upload Your Images

1. Use the Cloudflare dashboard to upload images, or
2. Use tools like [rclone](https://rclone.org/) or AWS CLI to upload files
3. Maintain the same directory structure as referenced in your code

### 5. Configure Environment Variables

Create a `.env.local` file based on the provided `.env.local.example`:

```
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=asce-images
R2_PUBLIC_DOMAIN=your-public-r2-domain  # Optional
NEXT_PUBLIC_USE_R2_STORAGE=true
NEXT_PUBLIC_USE_R2_SIGNED_URLS=true
```

## Public vs. Private Buckets

### Public Bucket Setup

1. Make your bucket public in the Cloudflare dashboard
2. Set `NEXT_PUBLIC_USE_R2_SIGNED_URLS=false` in your environment

### Private Bucket Setup

1. Keep your bucket private in the Cloudflare dashboard
2. Set `NEXT_PUBLIC_USE_R2_SIGNED_URLS=true` in your environment

## Image Components

### Using R2Image Component

For direct access to images in R2 Storage:

```jsx
import R2Image from '../components/R2Image';

<R2Image 
  path="images/ASCE.png"
  alt="ASCE Logo" 
  width={400}
  height={300}
/>
```

### Using R2PathImage Component

For using local image paths that map to R2:

```jsx
import R2PathImage from '../components/R2PathImage';

<R2PathImage 
  src="/images/ASCELOGO/ASCE.png"
  alt="ASCE Logo" 
  width={400}
  height={300}
/>
```

## Path Mapping

The application maintains a mapping between local image paths and R2 Storage paths in `app/utils/r2ImageLoader.ts`. Update this mapping when adding new images:

```javascript
export const PATH_TO_R2_MAP: Record<string, string> = {
  '/images/ASCELOGO/ASCE.png': 'images/ASCE.png',
  // Add more paths here
};
```

## Testing R2 Storage

Visit the `/r2-test` page to test your R2 Storage implementation. This page will show all images in your bucket and help troubleshoot any issues.

## Troubleshooting

If images aren't loading:

1. Check your Cloudflare dashboard to ensure R2 is properly set up
2. Verify your API credentials are correct
3. Check the access settings for your bucket
4. Confirm your environment variables are set correctly
5. Check browser console for specific error messages
6. Make sure the image paths in your code match the paths in R2 Storage

## Server-Side API Route

For additional security or advanced features, you can use the server-side API route at `/api/r2image?path=your-image-path`. This route:

1. Authenticates with R2 on the server side
2. Handles content types automatically
3. Provides proper caching headers
4. Protects your R2 credentials 