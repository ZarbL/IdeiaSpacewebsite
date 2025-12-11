'use client';

import React from 'react';
import './PartnersCarousel.css';

const PartnersCarousel = () => {
  const partners = [
    {
      logo: '/assets/partner1.png',
      name: 'Safe on orbit',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner2.png',
      name: 'IBICT',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner3.png',
      name: 'Saudi Space Agency',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner4.png',
      name: 'Partner 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner5.png',
      name: 'Partner 5',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner6.png',
      name: 'Partner 6',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner7.png',
      name: 'Partner 7',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner8.png',
      name: 'Partner 8',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner9.png',
      name: 'Partner 9',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      logo: '/assets/partner10.png',
      name: 'Partner 10',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];

  return (
    <div className="partners-carousel-wrapper">
      <div className="partners-carousel-container">
        {partners.map((partner, index) => (
          <div key={index} className="partner-card">
            <img src={partner.logo} alt={partner.name} className="partner-logo" />
            <div className="partner-card__content">
              <p className="partner-card__title">{partner.name}</p>
              <p className="partner-card__description">{partner.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PartnersCarousel;
