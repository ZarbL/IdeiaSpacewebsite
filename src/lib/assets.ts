/**
 * Asset URLs Configuration
 * Toggle USE_CLOUDINARY to switch between local and Cloudinary assets
 */

import { getCloudinaryVideoUrl, getCloudinaryImageUrl, cloudinaryAssets } from './cloudinary';

// Toggle this to use Cloudinary (true) or local assets (false)
const USE_CLOUDINARY = process.env.NEXT_PUBLIC_USE_CLOUDINARY === 'true';

export const assetUrls = {
  videos: {
    ideiaForward: USE_CLOUDINARY 
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.ideiaForward, { quality: 'auto', format: 'mp4' })
      : '/assets/ideiaforword.mp4',
    
    desafioEspacial: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.desafioEspacial, { quality: 'auto', format: 'mp4' })
      : '/assets/desafioespacial.mp4',
    
    galaxyEspiral: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.galaxyEspiral, { quality: 'auto', format: 'mp4' })
      : '/assets/galaxyespiral.mp4',
    
    planetaAgua: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.planetaAgua, { quality: 'auto', format: 'mp4' })
      : '/assets/planetaagua.mp4',
    
    metodology: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.metodology, { quality: 'auto', format: 'mp4' })
      : '/assets/metodology.mp4',
    
    nossaLideranca: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.nossaLideranca, { quality: 'auto', format: 'mp4' })
      : '/assets/nossalideranca.mp4',
    
    terraEspaco: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.terraEspaco, { quality: 'auto', format: 'mp4' })
      : '/assets/Terraespaco.mp4',
    
    terraNoite: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.terraNoite, { quality: 'auto', format: 'mp4' })
      : '/assets/terranoite.mp4',
    
    satelliteOrbit: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.satelliteOrbit, { quality: 'auto', format: 'mp4' })
      : '/assets/satellite-orbit.mp4',
    
    space: USE_CLOUDINARY
      ? getCloudinaryVideoUrl(cloudinaryAssets.videos.space, { quality: 'auto', format: 'mp4' })
      : '/assets/space.mp4',
  },
  
  images: {
    logo: USE_CLOUDINARY
      ? getCloudinaryImageUrl(cloudinaryAssets.images.logo, { quality: 'auto:best', format: 'auto' })
      : '/assets/vetorizada.png',
    
    homeDesafioEspacial: USE_CLOUDINARY
      ? getCloudinaryImageUrl(cloudinaryAssets.images.homeDesafioEspacial, { quality: 'auto:best', format: 'auto' })
      : '/assets/homedesafioespacial.png',
    
    nebulus: USE_CLOUDINARY
      ? getCloudinaryImageUrl(cloudinaryAssets.images.nebulus, { quality: 'auto:best', format: 'auto' })
      : '/assets/nebulus.png',
  }
};

export { USE_CLOUDINARY };
