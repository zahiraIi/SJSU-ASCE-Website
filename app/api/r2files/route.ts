import { NextResponse } from 'next/server';
import { listR2Objects } from '../../lib/r2'; // Adjust path as needed

// Optional: Cache the file list in memory to reduce R2 API calls
let cachedFileList: string[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // Cache for 5 minutes

export async function GET() {
  const now = Date.now();

  // Check cache first
  if (cachedFileList && now - cacheTimestamp < CACHE_DURATION) {
    console.log('Returning cached R2 file list');
    return NextResponse.json(cachedFileList);
  }

  try {
    console.log('Fetching fresh R2 file list');
    const files = await listR2Objects(); // Get all files

    // Update cache
    cachedFileList = files;
    cacheTimestamp = now;

    return NextResponse.json(files, {
      headers: {
        // Cache on the client/CDN for 1 minute, allow stale-while-revalidate for 5 minutes
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching R2 file list:', error);
    // Clear cache on error
    cachedFileList = null;
    cacheTimestamp = 0;
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Optional: Add revalidation configuration if needed for Next.js App Router
// export const revalidate = 300; // Revalidate every 5 minutes (example) 