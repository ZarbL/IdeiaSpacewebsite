'use client';

import React from 'react';
import { getImageUrl } from '@/lib/cloudinary';
import './PartnersCarousel.css';

const PartnersCarousel = () => {
  const partners = [
    { logo: getImageUrl('partner1.png'), name: 'Safe on orbit' },
    { logo: getImageUrl('partner2.png'), name: 'IBICT' },
    { logo: getImageUrl('partner3.png'), name: 'Saudi Space Agency' },
    { logo: getImageUrl('partner4.png'), name: 'Partner 4' },
    { logo: getImageUrl('partner5.png'), name: 'Partner 5' },
    { logo: getImageUrl('partner6.png'), name: 'Partner 6' },
    { logo: getImageUrl('partner7.png'), name: 'Partner 7' },
    { logo: getImageUrl('partner8.png'), name: 'Partner 8' },
    { logo: getImageUrl('partner9.png'), name: 'Partner 9' }
  ];

  return (
    <div className="partners-carousel-wrapper">
      <div className="partners-carousel-container">
        {partners.map((partner, index) => (
          <div key={index} className="partner-card">
            <img src={partner.logo} alt={partner.name} className="partner-logo" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersCarousel;
