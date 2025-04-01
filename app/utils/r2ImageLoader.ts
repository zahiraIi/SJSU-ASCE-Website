/**
 * Utility functions for loading images from Cloudflare R2 Storage
 */
import { getSignedR2Url, getPublicR2Url } from '../lib/r2';

// Default fallback image
const FALLBACK_IMAGE = '/images/fallback.jpg';

// Whether to use Cloudflare R2 for image storage
const USE_R2_STORAGE = process.env.NEXT_PUBLIC_USE_R2_STORAGE === 'true';

// Whether to use signed URLs (private bucket) or public URLs
const USE_SIGNED_URLS = process.env.NEXT_PUBLIC_USE_R2_SIGNED_URLS === 'true';

/**
 * Map of local image paths to R2 Storage paths
 * This allows us to reference images using local paths in components
 * while loading them from R2 Storage
 */
export const PATH_TO_R2_MAP: Record<string, string> = {
  // ASCE Logo
  '/images/ASCELOGO/ASCE.png': 'ASCELOGO/ASCE.png',
  '/images/ASCELOGO/officer.jpg': 'ASCELOGO/officer.jpg',
  
  // FGM Pics
  '/images/FGM Pics/DSC00698.JPG': 'FGM Pics/DSC00698.JPG',
  '/images/FGM Pics/DSC00700.JPG': 'FGM Pics/DSC00700.JPG',
  '/images/FGM Pics/possiblefrontpage.JPG': 'FGM Pics/possiblefrontpage.JPG',
  '/images/FGM Pics/generalmeeting.JPG': 'FGM Pics/generalmeeting.JPG',
  '/images/FGM Pics/generalmeeting2.JPG': 'FGM Pics/generalmeeting2.JPG',
  '/images/FGM Pics/clubofficer1.JPG': 'FGM Pics/clubofficer1.JPG',
  '/images/FGM Pics/clubofficer2.JPG': 'FGM Pics/clubofficer2.JPG',
  '/images/FGM Pics/clubofficer3.JPG': 'FGM Pics/clubofficer3.JPG',
  '/images/FGM Pics/clubofficer4.JPG': 'FGM Pics/clubofficer4.JPG',
  '/images/FGM Pics/clubofficer5.JPG': 'FGM Pics/clubofficer5.JPG',
  '/images/FGM Pics/clubofficer6.JPG': 'FGM Pics/clubofficer6.JPG',
  '/images/FGM Pics/funnyclubofficer.JPG': 'FGM Pics/funnyclubofficer.JPG',
  
  // Hike 3-1
  '/images/Hike 3-1/IMG_1607.jpg': 'Hike 3-1/IMG_1607.jpg',
  '/images/Hike 3-1/IMG_1619.jpg': 'Hike 3-1/IMG_1619.jpg',
  '/images/Hike 3-1/IMG_1638.jpg': 'Hike 3-1/IMG_1638.jpg',
  '/images/Hike 3-1/IMG_6723.MOV': 'Hike 3-1/IMG_6723.MOV',
  '/images/Hike 3-1/IMG_6774.JPG': 'Hike 3-1/IMG_6774.JPG',
  '/images/Hike 3-1/IMG_6777.JPG': 'Hike 3-1/IMG_6777.JPG',
  '/images/Hike 3-1/IMG_6794.MOV': 'Hike 3-1/IMG_6794.MOV',
  
  // L&L
  '/images/L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg': 'L&L/jpg/2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg',
  '/images/L&L/jpg/IMG_1424.jpg': 'L&L/jpg/IMG_1424.jpg',
  '/images/L&L/jpg/IMG_2301.jpg': 'L&L/jpg/IMG_2301.jpg',
  '/images/L&L/jpg/lunchandlearn.jpg': 'L&L/jpg/lunchandlearn.jpg',
  '/images/L&L/jpg/lunchandlearn2.jpg': 'L&L/jpg/lunchandlearn2.jpg',
  '/images/L&L/jpg/lunchandlearn3.jpg': 'L&L/jpg/lunchandlearn3.jpg',
  '/images/L&L/jpg/lunchandlearn4.jpg': 'L&L/jpg/lunchandlearn4.jpg',
  '/images/L&L/jpg/lunchandlearn5.jpg': 'L&L/jpg/lunchandlearn5.jpg',
  '/images/L&L/jpg/lunchandlearn6.jpg': 'L&L/jpg/lunchandlearn6.jpg',
  
  // Monterrey 2-15
  '/images/Monterrey 2-15/IMG_0911_Original.JPG': 'Monterrey 2-15/IMG_0911_Original.JPG',
  '/images/Monterrey 2-15/IMG_0915_Original.JPG': 'Monterrey 2-15/IMG_0915_Original.JPG',
  '/images/Monterrey 2-15/IMG_0968_Original.JPG': 'Monterrey 2-15/IMG_0968_Original.JPG',
  
  // SJSUSPARTANLOGO
  '/images/SJSUSPARTANLOGO/sjsuspartanlogo.png': 'SJSUSPARTANLOGO/sjsuspartanlogo.png',
  
  // Tabling
  '/images/Tabling/ascetabling.jpg': 'Tabling/ascetabling.jpg',
  '/images/Tabling/ascetabling2.jpg': 'Tabling/ascetabling2.jpg',
  '/images/Tabling/asce2025officers.jpg': 'Tabling/asce2025officers.jpg',
  
  // Event images
  '/images/Events/3-20-Networking-Event/DSC02298.JPG': 'images/Events/3-20-Networking-Event/DSC02298.JPG',
  '/images/Events/3-20-Networking-Event/DSC02302.JPG': 'images/Events/3-20-Networking-Event/DSC02302.JPG',
  '/images/Events/3-20-Networking-Event/DSC02308.JPG': 'images/Events/3-20-Networking-Event/DSC02308.JPG',
  '/images/Events/3-20-Networking-Event/DSC02312.JPG': 'images/Events/3-20-Networking-Event/DSC02312.JPG',
  '/images/Events/3-20-Networking-Event/DSC02320.JPG': 'images/Events/3-20-Networking-Event/DSC02320.JPG',
  '/images/Events/3-20-Networking-Event/DSC02340.JPG': 'images/Events/3-20-Networking-Event/DSC02340.JPG',
  
  // Officers
  '/images/officers/Asma (ASCE officer photo verticle shot).jpg': 'officers/Asma (ASCE officer photo verticle shot).jpg',
  '/images/officers/asma asce.jpg': 'officers/asma asce.jpg',
  '/images/officers/stephanie.jpg': 'officers/stephanie.jpg',
  '/images/officers/stephanie verticle shot.jpg': 'officers/stephanie verticle shot.jpg',
  '/images/officers/yasmin.JPG': 'officers/yasmin.JPG',
  
  // Sponsors
  '/images/sponsors/carlson-barbee-gibson-inc-cbg.png': 'sponsors/carlson-barbee-gibson-inc-cbg.png',
  '/images/sponsors/city-of-palo-alto.png': 'sponsors/city-of-palo-alto.png',
  '/images/sponsors/city-of-san-jose-public-works-department.png': 'sponsors/city-of-san-jose-public-works-department.png',
  '/images/sponsors/civil-engineering-associates-inc.png': 'sponsors/civil-engineering-associates-inc.png',
  '/images/sponsors/desilva-gates-construction.png': 'sponsors/desilva-gates-construction.png',
  '/images/sponsors/graniterock.png': 'sponsors/graniterock.png',
  '/images/sponsors/hmh-engineers.png': 'sponsors/hmh-engineers.png',
  '/images/sponsors/kpff.png': 'sponsors/kpff.png',
  '/images/sponsors/level-10-construction.png': 'sponsors/level-10-construction.png',
  '/images/sponsors/mark-thomas.png': 'sponsors/mark-thomas.png',
  '/images/sponsors/mcguire-and-hester.png': 'sponsors/mcguire-and-hester.png',
  '/images/sponsors/ntk-construction-inc.png': 'sponsors/ntk-construction-inc.png',
  '/images/sponsors/pase.png': 'sponsors/pase.png',
  '/images/sponsors/performance-contracting-inc.png': 'sponsors/performance-contracting-inc.png',
  '/images/sponsors/rodan-builders-inc.png': 'sponsors/rodan-builders-inc.png',
  '/images/sponsors/rudolph-and-sletten-inc.png': 'sponsors/rudolph-and-sletten-inc.png',
  '/images/sponsors/ruggeri-jensen-azar.png': 'sponsors/ruggeri-jensen-azar.png',
  '/images/sponsors/schaaf-wheeler-consulting-civil-engineers.png': 'sponsors/schaaf-wheeler-consulting-civil-engineers.png',
  '/images/sponsors/simpson-gumpertz-heger.png': 'sponsors/simpson-gumpertz-heger.png',
  '/images/sponsors/technical-builders.png': 'sponsors/technical-builders.png',
  '/images/sponsors/the-core-group.png': 'sponsors/the-core-group.png',
  '/images/sponsors/vulcan-materials-company.png': 'sponsors/vulcan-materials-company.png',
  '/images/sponsors/whiting-turner.png': 'sponsors/whiting-turner.png',
  '/images/sponsors/xl-construction.png': 'sponsors/xl-construction.png',
  
  // Fallback image
  '/images/fallback.jpg': 'images/fallback.jpg'
};

/**
 * Get an R2 Storage path from a local file path
 */
export function getR2PathFromLocal(path: string): string | null {
  // Direct lookup
  if (PATH_TO_R2_MAP[path]) {
    return PATH_TO_R2_MAP[path];
  }
  
  // Try a partial match using the filename
  const filename = path.split('/').pop()?.toLowerCase() || '';
  if (filename) {
    const partialMatches = Object.entries(PATH_TO_R2_MAP).filter(([key]) => 
      key.toLowerCase().includes(filename)
    );
    
    if (partialMatches.length > 0) {
      return partialMatches[0][1];
    }
  }
  
  return null;
}

/**
 * Get a URL for an image from Cloudflare R2
 */
export async function getR2ImageUrl(path: string): Promise<string> {
  if (!path) return FALLBACK_IMAGE;
  
  console.log('getR2ImageUrl - Input path:', path);
  console.log('getR2ImageUrl - USE_SIGNED_URLS:', USE_SIGNED_URLS);
  
  try {
    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
      console.log('getR2ImageUrl - Using existing URL:', path);
      return path;
    }
    
    // Get the appropriate URL from R2 based on configuration
    let url: string;
    if (USE_SIGNED_URLS) {
      // Use the API route which handles authentication server-side
      url = `/api/r2image?path=${encodeURIComponent(path)}`;
      console.log('getR2ImageUrl - Using API route:', url);
    } else {
      // Get a public URL (for public buckets)
      url = getPublicR2Url(path);
    }
    
    console.log('getR2ImageUrl - Got R2 URL:', url);
    return url;
  } catch (error) {
    console.error('Error getting R2 image URL:', error);
    return FALLBACK_IMAGE;
  }
}

/**
 * Get an image URL from a path, checking R2 Storage first
 */
export async function loadImage(path: string): Promise<string> {
  if (!path) return FALLBACK_IMAGE;
  
  console.log('loadImage - Input path:', path);
  
  try {
    // If it's already a full URL, return as is
    if (path.startsWith('http')) {
      console.log('loadImage - Using existing URL:', path);
      return path;
    }
    
    // If R2 storage is enabled
    if (USE_R2_STORAGE) {
      // Try to find an R2 path for this local path
      const r2Path = getR2PathFromLocal(path);
      if (r2Path) {
        console.log('loadImage - Found R2 mapping:', path, ' -> ', r2Path);
        
        // Get the image URL from R2
        try {
          const url = await getR2ImageUrl(r2Path);
          console.log('loadImage - Using R2 URL:', url);
          return url;
        } catch (error) {
          console.error('Error fetching from R2, falling back to local path:', error);
        }
      }
    }
    
    // If no R2 mapping found or R2 is disabled, return the original path
    console.warn(`No R2 mapping found for: ${path}`);
    return path;
  } catch (err) {
    console.error('Error loading image:', err);
    return FALLBACK_IMAGE;
  }
} 