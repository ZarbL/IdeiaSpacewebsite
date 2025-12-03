// Cloudinary helper utilities
// Get your credentials from: https://console.cloudinary.com/

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

if (!CLOUDINARY_CLOUD_NAME) {
  console.warn('⚠️ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
}

/**
 * Generate Cloudinary URL for videos
 * @param publicId - The public ID of the video in Cloudinary
 * @param options - Transformation options
 * @returns Full Cloudinary URL
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
 * @param publicId - The public ID of the image in Cloudinary
 * @param options - Transformation options
 * @returns Full Cloudinary URL
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
 * Asset paths mapping - Replace with your Cloudinary public IDs after upload
 */
export const cloudinaryAssets = {
  // Videos
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
  
  // Images
  images: {
    logo: 'ideiaspace/images/vetorizada',
    homeDesafioEspacial: 'ideiaspace/images/homedesafioespacial',
    nebulus: 'ideiaspace/images/nebulus',
    falcon9: 'ideiaspace/images/falcon9',
    
    // Leadership
    liderLeonardo: 'ideiaspace/images/lider-leonardo',
    liderLuis: 'ideiaspace/images/lider-luis',
    liderMatheus: 'ideiaspace/images/lider-matheus',
    liderRafael: 'ideiaspace/images/lider-rafael',
    liderVictorBatista: 'ideiaspace/images/lider-victor-batista',
    
    // Team
    marianaFromIdeia: 'ideiaspace/images/mariana-from-ideia-site',
    rosenoFromIdeia: 'ideiaspace/images/roseno-from-ideia-site',
    
    // Cards
    card1: 'ideiaspace/images/card1',
    card2: 'ideiaspace/images/card2',
    card3: 'ideiaspace/images/card3',
    card4: 'ideiaspace/images/card4',
    card5: 'ideiaspace/images/card5',
    
    // Carousel
    carrosel1: 'ideiaspace/images/carrosel1',
    carrosel2: 'ideiaspace/images/carrosel2',
    carrosel3: 'ideiaspace/images/carrosel3',
    
    // Impact
    impactoCard1: 'ideiaspace/images/impactocard1',
    impactoCard3: 'ideiaspace/images/impactocard3',
    
    // Technologies
    kiteducational: 'ideiaspace/images/kiteducational',
    packetqube: 'ideiaspace/images/packetqube',
    missionProgrammingTool: 'ideiaspace/images/mission-programming-tool',
  }
};
