'use client';

import React from 'react';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import './HistoryCarousel.css';

const HistoryCarousel = () => {
  return (
    <div className="history-carousel-wrapper">
      <div className="history-carousel-container">
        <div className="history-card">
          <img src={getImageUrl('beneficio2.png')} alt="História 1" className="history-video" />
        </div>
        <div className="history-card">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="history-video"
          >
            <source src={getVideoUrl('historia2.mp4')} type="video/mp4" />
          </video>
        </div>
        <div className="history-card">
          <img src={getImageUrl('card3.png')} alt="História 3" className="history-video" />
        </div>
      </div>
    </div>
  );
}

export default HistoryCarousel;
