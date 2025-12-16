'use client';

import React, { useState } from 'react';
import './PhasesCarousel.css';

interface Phase {
  number: number;
  title: string;
  description: string;
}

interface PhasesCarouselProps {
  phases: Phase[];
}

const PhasesCarousel = ({ phases }: PhasesCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % phases.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + phases.length) % phases.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="phases-carousel">
      <div className="phases-carousel-container">
        <div 
          className="phases-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {phases.map((phase, index) => (
            <div key={index} className="phase-card">
              <div className="phase-number">
                <span>{phase.number}</span>
              </div>
              <h3 className="phase-title">{phase.title}</h3>
              <p className="phase-description">{phase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={prevSlide} 
        className="phases-carousel-button phases-carousel-button-prev"
        aria-label="Previous phase"
      >
        ‹
      </button>
      <button 
        onClick={nextSlide} 
        className="phases-carousel-button phases-carousel-button-next"
        aria-label="Next phase"
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div className="phases-carousel-dots">
        {phases.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`phases-carousel-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to phase ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PhasesCarousel;
