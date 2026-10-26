'use client';

import React from 'react';
import Image from 'next/image';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import './HistoryCarousel.css';

const HistoryCarousel = () => {
  return (
    <div className="history-carousel-wrapper">
      <div className="history-carousel-container">
        <div className="history-card">
          <Image src={getImageUrl('beneficio2.png')} alt="História 1" fill sizes="280px" className="history-video" />
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
          <Image src={getImageUrl('card3.png')} alt="História 3" fill sizes="280px" className="history-video" />
        </div>
      </div>
    </div>
  );
}

export default HistoryCarousel;
