import { Photo } from '../types';

// Define all photo categories from our Photos directory
export const photoCategories = {
  LUNCH_AND_LEARN: 'Lunch & Learn',
  NETWORKING: 'Networking Events',
  SOCIAL_EVENTS: 'Social Events',
  TABLING: 'Tabling',
  OFFICERS: 'Officers',
  GENERAL: 'General'
};

// Map to translate folder names to proper display names
const folderToCategory = {
  'L&L': photoCategories.LUNCH_AND_LEARN,
  'Social Events': photoCategories.SOCIAL_EVENTS,
  'Tabling': photoCategories.TABLING,
  'New Officer Photos': photoCategories.OFFICERS,
  'FGM Pics': photoCategories.GENERAL
};

// Function to create dummy array of filenames for patterns that match a sequence
const createSequentialArray = (prefix: string, start: number, count: number, suffix: string): string[] => {
  return Array.from({ length: count }, (_, i) => `${prefix}${start + i}${suffix}`);
};

// Define photo paths and metadata
export const getAllPhotos = (): Photo[] => {
  const photos: Photo[] = [
    // Lunch & Learn Photos - updated path
    ...[
      // Specific named files
      'IMG_1424.jpg',
      '2CF3DC47-7952-4E4F-9F59-FF38867A7D45.jpg',
      'IMG_1697.jpg',
      '0499ADED-C77B-4993-B764-08D7F6C744E9.jpg',
      '72880778913__2569B296-26D7-4D2B-90B7-BE00C843D4BC.jpg',
      'BFFF0733-3DCC-41A4-B287-D767D0FBB981.jpg',
      'FDD826DB-376B-4211-8B5C-1874B5662FDF.jpg',
      'IMG_0196.jpg',
      'IMG_1698.jpg',
      'IMG_1699.jpg',
      'IMG_1700.jpg',
      'IMG_1702.jpg',
      'IMG_2301.jpg',
      'IMG_2302.jpg',
      'IMG_2303.jpg',
      'IMG_2304.jpg',
      'IMG_2305.jpg',
      'IMG_2306.jpg',
      'IMG_2307.jpg',
      'IMG_2308.jpg',
      'IMG_2309.jpg',
      'IMG_2310.jpg',
      'IMG_9216.jpg',
      'IMG_9217.jpg',
      'IMG_9385.jpg',
      'DSC00139.jpg',
      'DSC00141.jpg',
      'DSC00142.jpg',
      'DSC00144.jpg',
      'DSC00145.jpg',
      'lunchandlearn.jpg',
      'lunchandlearn2.jpg',
      'lunchandlearn3.jpg',
      'lunchandlearn4.jpg',
      'lunchandlearn5.jpg',
      'lunchandlearn6.jpg'
    ].map(filename => ({
      src: `L&L/jpg/${filename}`,
      alt: `Lunch & Learn Event - ${filename.split('.')[0]}`,
      category: photoCategories.LUNCH_AND_LEARN
    })),

    // Social Events - Networking - updated path
    ...[
      // Add actual filenames here
      'DSC00698.JPG',
      'DSC00700.JPG',
      'DSC00701.JPG',
      'DSC00703.JPG',
      'DSC00704.JPG',
      'DSC00712.JPG',
      'DSC00716.JPG',
      'DSC00718.JPG'
    ].map(filename => ({
      src: `FGM Pics/${filename}`,
      alt: `ASCE Event - ${filename.split('.')[0]}`,
      category: photoCategories.NETWORKING
    })),

    // Social Events - General - updated path
    ...[
      'possiblefrontpage.JPG',
      'generalmeeting.JPG',
      'generalmeeting2.JPG',
      'generalmeeting(1).JPG'
    ].map(filename => ({
      src: `FGM Pics/${filename}`,
      alt: `ASCE Meeting - ${filename.split('.')[0].replace(/([A-Z])/g, ' $1').trim()}`,
      category: photoCategories.SOCIAL_EVENTS
    })),

    // Officers - updated path
    ...[
      'clubofficer1.JPG',
      'clubofficer2.JPG',
      'clubofficer3.JPG',
      'clubofficer4.JPG',
      'clubofficer5.JPG',
      'clubofficer6.JPG',
      'funnyclubofficer.JPG'
    ].map(filename => ({
      src: `FGM Pics/${filename}`,
      alt: `ASCE Officer - ${filename.split('.')[0]}`,
      category: photoCategories.OFFICERS
    })),

    // Tabling Photos - updated path
    ...[
      'ascetabling.jpg',
      'ascetabling2.jpg',
      'asce2025officers.jpg',
      'DSC04632.JPG',
      'DSC04633.JPG',
      'DSC04634.JPG',
      'DSC04635.JPG',
      'DSC04636.JPG',
      'DSC04637.JPG',
      'DSC04638.JPG',
      'DSC04639.JPG'
    ].map(filename => ({
      src: `Tabling/${filename}`,
      alt: `ASCE Tabling - ${filename.split('.')[0]}`,
      category: photoCategories.TABLING
    }))
  ];

  // Return and filter out any potential 404s
  return photos;
};

// Function to get photos by category
export const getPhotosByCategory = (category: string): Photo[] => {
  return getAllPhotos().filter(photo => photo.category === category);
};

// Function to get a featured subset of photos from all categories
export const getFeaturedPhotos = (count = 12): Photo[] => {
  const allPhotos = getAllPhotos();
  
  // Get an even distribution from each category if possible
  const categories = Object.values(photoCategories);
  const photosPerCategory = Math.ceil(count / categories.length);
  
  let featuredPhotos: Photo[] = [];
  
  categories.forEach(category => {
    const categoryPhotos = allPhotos
      .filter(photo => photo.category === category)
      .slice(0, photosPerCategory);
    
    featuredPhotos = [...featuredPhotos, ...categoryPhotos];
  });
  
  // Trim to requested count and shuffle
  return featuredPhotos
    .slice(0, count)
    .sort(() => Math.random() - 0.5);
};

/**
 * Get random photos from the entire collection or a specific category
 * @param count Number of random photos to return
 * @param category Optional category to filter by
 * @returns Array of random photos
 */
export const getRandomPhotos = (count = 8, category?: string): Photo[] => {
  const photos = category 
    ? getPhotosByCategory(category) 
    : getAllPhotos();
  
  // Create a copy to avoid modifying the original array
  const photosCopy = [...photos];
  
  // Shuffle array using Fisher-Yates algorithm
  for (let i = photosCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [photosCopy[i], photosCopy[j]] = [photosCopy[j], photosCopy[i]];
  }
  
  return photosCopy.slice(0, count);
};

/**
 * Search photos by keyword in alt text or category
 * @param keyword Search term
 * @returns Array of matching photos
 */
export const searchPhotosByKeyword = (keyword: string): Photo[] => {
  if (!keyword || keyword.trim() === '') {
    return [];
  }
  
  const searchTerm = keyword.toLowerCase().trim();
  
  return getAllPhotos().filter(photo => 
    photo.alt.toLowerCase().includes(searchTerm) || 
    photo.category.toLowerCase().includes(searchTerm) ||
    (photo.src.toLowerCase().includes(searchTerm))
  );
}; 