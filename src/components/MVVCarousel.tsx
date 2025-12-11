'use client';

import React from 'react';
import './MVVCarousel.css';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';

const MVVCarousel = () => {
  return (
    <div className="mvv-carousel-wrapper">
      <div className="mvv-carousel-container">
        <div className="mvv-card">
          <img src={getImageUrl('impactocard1.png')} alt="Leader" className="mvv-image" />
        </div>
        <div className="mvv-card">
          <video autoPlay loop muted playsInline className="mvv-video">
            <source src={getVideoUrl('historia3.mp4')} type="video/mp4" />
          </video>
        </div>
        <div className="mvv-card">
          <img src={getImageUrl('impactocard3.png')} alt="Leader" className="mvv-image" />
        </div>
      </div>
    </div>
  );
}

export default MVVCarousel;
