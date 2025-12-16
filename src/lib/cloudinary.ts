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
  
  // Default to auto:eco for better performance
  transformations.push(`q_${options?.quality || 'auto:eco'}`);
  
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  
  // Default to auto format for best compression
  transformations.push(`f_${options?.format || 'auto'}`);
  
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
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
    format?: 'png' | 'jpg' | 'webp' | 'avif' | 'auto';
    width?: number;
    height?: number;
  }
): string {
  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  
  const transformations: string[] = [];
  
  // Use quality 80 for better performance while maintaining good quality
  transformations.push(`q_${options?.quality || 80}`);
  
  if (options?.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options?.height) {
    transformations.push(`h_${options.height}`);
  }
  
  // Default to auto format (WebP/AVIF when supported)
  transformations.push(`f_${options?.format || 'auto'}`);
  
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
    'ideiaforword.mp4': 'ideiaspace/ideiaforword',
    'desafioespacial.mp4': 'ideiaspace/desafioespacial',
    'galaxyespiral.mp4': 'ideiaspace/galaxyespiral',
    'planetaagua.mp4': 'ideiaspace/planetaagua',
    'metodology.mp4': 'ideiaspace/metodology',
    'nossalideranca.mp4': 'ideiaspace/nossalideranca',
    'Terraespaco.mp4': 'ideiaspace/Terraespaco',
    'terraespaco.mp4': 'ideiaspace/Terraespaco',
    'terranoite.mp4': 'ideiaspace/terranoite',
    'space.mp4': 'ideiaspace/space',
    'emblema.mp4': 'ideiaspace/emblema',
    'historia1.mp4': 'ideiaspace/historia1',
    'historia2.mp4': 'ideiaspace/historia2',
    'historia3.mp4': 'ideiaspace/historia3',
    'satellite-orbit.mp4': 'ideiaspace/galaxyespiral',
    'impactocard4.mp4': 'ideiaspace/impactocard4',
    'impactocard2.MP4': 'ideiaspace/impactocard2',
  };

  if (USE_CLOUDINARY && videoMap[filename]) {
    return getCloudinaryVideoUrl(videoMap[filename], { quality: 'auto:eco', format: 'auto' });
  }
  
  return `/assets/${filename}`;
}

/**
 * Helper function to get image URL (Cloudinary or local)
 */
export function getImageUrl(filename: string): string {
  // vetorizada.png (logo) always loads from local/GitHub
  if (filename === 'vetorizada.png') {
    return `/assets/${filename}`;
  }

  const imageMap: Record<string, string> = {
    'falcon9.jpg': 'ideiaspace/falcon9',
    'kiteducational.png': 'ideiaspace/kiteducational',
    'MissionProgrammingTool.png': 'ideiaspace/MissionProgrammingTool',
    'card1.png': 'ideiaspace/card1',
    'card2.png': 'ideiaspace/card2',
    'card3.png': 'ideiaspace/card3',
    'card4.jpg': 'ideiaspace/card4',
    'card5.jpg': 'ideiaspace/card5',
    'impactocard1.png': 'ideiaspace/impactocard1',
    'impactocard3.png': 'ideiaspace/impactocard3',
    'beneficio1.png': 'ideiaspace/beneficio1',
    'beneficio2.png': 'ideiaspace/beneficio2',
    'beneficio3.png': 'ideiaspace/beneficio3',
    'nebulus.png': 'ideiaspace/nebulus',
    'student3.png': 'ideiaspace/student3',
    'LiderMatheus.png': 'ideiaspace/LiderMatheus',
    'LiderLeonardo.png': 'ideiaspace/LiderLeonardo',
    'LiderRafael.png': 'ideiaspace/LiderRafael',
    'LiderVictorBatista.png': 'ideiaspace/LiderVictorBatista',
    'MarianafromIdeiaSite.png': 'ideiaspace/MarianafromIdeiaSite',
    'RosenofromIdeiaSite.png': 'ideiaspace/RosenofromIdeiaSite',
    'partner1.png': 'ideiaspace/partner1',
    'partner2.png': 'ideiaspace/partner2',
    'partner3.png': 'ideiaspace/partner3',
    'partner4.png': 'ideiaspace/partner4',
    'partner5.png': 'ideiaspace/partner5',
    'partner6.png': 'ideiaspace/partner6',
    'partner7.png': 'ideiaspace/partner7',
    'partner8.png': 'ideiaspace/partner8',
    'transporter15.png': 'ideiaspace/transporter15',
    'Recursos.png': 'ideiaspace/Recursos',
  };

  if (USE_CLOUDINARY && imageMap[filename]) {
    return getCloudinaryImageUrl(imageMap[filename], { quality: 80, format: 'auto' });
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
