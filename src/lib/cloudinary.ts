// Cloudinary helper utilities
// Get your credentials from: https://console.cloudinary.com/

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dgyueliom';
const USE_CLOUDINARY = process.env.NEXT_PUBLIC_USE_CLOUDINARY === 'true';

/**
 * Generate Cloudinary URL for videos
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  options?: {
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low';
    format?: 'mp4' | 'webm' | 'auto';
    width?: number;
    height?: number;
  }
): string {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload`;
  
  const transformations: string[] = [];
  
  if (options?.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  
  if (options?.format) {
    transformations.push(`f_${options.format}`);
  }
  
  const transformString = transformations.length > 0 
    ? `/${transformations.join(',')}/` 
    : '/';
  
  return `${baseUrl}${transformString}${publicId}`;
}

/**
 * Generate Cloudinary URL for images
 */
export function getCloudinaryImageUrl(
  publicId: string,
  options?: {
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low';
    format?: 'png' | 'jpg' | 'webp' | 'avif' | 'auto';
    width?: number;
    height?: number;
  }
): string {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  const transformations: string[] = [];
  
  if (options?.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  
  if (options?.format) {
    transformations.push(`f_${options.format}`);
  }
  
  const transformString = transformations.length > 0 
    ? `/${transformations.join(',')}/` 
    : '/';
  
  return `${baseUrl}${transformString}${publicId}`;
}

/**
 * Helper function to get video URL (Cloudinary or local)
 */
export function getVideoUrl(filename: string): string {
  const videoMap: Record<string, string> = {
    'ideiaforword.mp4': 'ideiaspace/videos/ideiaforword.mp4',
    'desafioespacial.mp4': 'ideiaspace/videos/desafioespacial.mp4',
    'galaxyespiral.mp4': 'ideiaspace/videos/galaxyespiral.mp4',
    'planetaagua.mp4': 'ideiaspace/videos/planetaagua.mp4',
    'metodology.mp4': 'ideiaspace/videos/metodology.mp4',
    'nossalideranca.mp4': 'ideiaspace/videos/nossalideranca.mp4',
    'Terraespaco.mp4': 'ideiaspace/videos/terraespaco.mp4',
    'terraespaco.mp4': 'ideiaspace/videos/terraespaco.mp4',
    'terranoite.mp4': 'ideiaspace/videos/terranoite.mp4',
    'satellite-orbit.mp4': 'ideiaspace/videos/satellite-orbit.mp4',
    'space.mp4': 'ideiaspace/videos/space.mp4',
    'impactocard4.mp4': 'ideiaspace/videos/impactocard4.mp4',
    'impactocard2.MP4': 'ideiaspace/videos/impactocard2.mp4',
  };

  if (USE_CLOUDINARY && videoMap[filename]) {
    return getCloudinaryVideoUrl(videoMap[filename], { quality: 'auto', format: 'mp4' });
  }
  
  return `/assets/${filename}`;
}

/**
 * Asset paths mapping
 */
export const cloudinaryAssets = {
  videos: {
    ideiaForward: 'ideiaspace/videos/ideiaforword',
    desafioEspacial: 'ideiaspace/videos/desafioespacial',
    galaxyEspiral: 'ideiaspace/videos/galaxyespiral',
    planetaAgua: 'ideiaspace/videos/planetaagua',
    metodology: 'ideiaspace/videos/metodology',
    nossaLideranca: 'ideiaspace/videos/nossalideranca',
    terraEspaco: 'ideiaspace/videos/terraespaco',
    terraNoite: 'ideiaspace/videos/terranoite',
    satelliteOrbit: 'ideiaspace/videos/satellite-orbit',
    space: 'ideiaspace/videos/space',
    impactoCard4: 'ideiaspace/videos/impactocard4',
    impactoCard2: 'ideiaspace/videos/impactocard2',
  },
  
  images: {
    logo: 'ideiaspace/images/vetorizada',
    homeDesafioEspacial: 'ideiaspace/images/homedesafioespacial',
    nebulus: 'ideiaspace/images/nebulus',
  }
};
