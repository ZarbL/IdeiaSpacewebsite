'use client';

import { useEffect, useRef } from 'react';

interface SlowVideoProps {
  src: string;
}

export default function SlowVideo({ src }: SlowVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.1;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
      style={{ filter: 'brightness(0.8)', transform: 'scale(1.1)' }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
