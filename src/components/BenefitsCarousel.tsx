'use client';

import React from 'react';
import Image from 'next/image';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import './BenefitsCarousel.css';

const BenefitsCarousel = () => {
  return (
    <div className="benefits-carousel-wrapper">
      <div className="benefits-carousel-container">
        <div className="benefits-card">
          <Image src={getImageUrl('beneficio1.png')} alt="Benefício 1" fill sizes="280px" className="benefits-image" />
        </div>
        <div className="benefits-card">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="benefits-image"
          >
            <source src={getVideoUrl('historia1.mp4')} type="video/mp4" />
          </video>
        </div>
        <div className="benefits-card">
          <Image src={getImageUrl('beneficio3.png')} alt="Benefício 3" fill sizes="280px" className="benefits-image" />
        </div>
      </div>
    </div>
  );
}

export default BenefitsCarousel;
