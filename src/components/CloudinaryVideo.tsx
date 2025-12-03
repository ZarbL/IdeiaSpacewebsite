'use client';

import { getCloudinaryVideoUrl } from '@/lib/cloudinary';

interface CloudinaryVideoProps {
  publicId?: string;
  src?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low';
}

/**
 * Optimized video component using Cloudinary CDN
 * Automatically serves best format (MP4, WebM) based on browser support
 * Can use either publicId (Cloudinary) or src (local/other CDN)
 */
export default function CloudinaryVideo({
  publicId,
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  quality = 'auto'
}: CloudinaryVideoProps) {
  // Use Cloudinary if publicId is provided, otherwise fallback to src
  const videoSources = publicId 
    ? {
        webm: getCloudinaryVideoUrl(publicId, { quality, format: 'webm' }),
        mp4: getCloudinaryVideoUrl(publicId, { quality, format: 'mp4' })
      }
    : { mp4: src || '' };

  return (
    <video
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      className={className}
    >
      {videoSources.webm && <source src={videoSources.webm} type="video/webm" />}
      <source src={videoSources.mp4} type="video/mp4" />
    </video>
  );
}
