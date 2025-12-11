'use client';

import React, { useState, useEffect } from 'react';
import TestimonialCard from './TestimonialCard';
import './TestimonialsCarousel.css';

interface Testimonial {
  name: string;
  message: string;
  image: string;
  rating: number;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance carousel every 5 seconds (only when not paused)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const getSlideClass = (index: number) => {
    if (index === currentIndex) return 'slide active';
    if (index === (currentIndex - 1 + testimonials.length) % testimonials.length) return 'slide prev';
    if (index === (currentIndex + 1) % testimonials.length) return 'slide next';
    return 'slide hidden';
  };

  return (
    <div 
      className="testimonials-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="carousel-container">
        {/* Previous Button */}
        <button className="carousel-button prev-button" onClick={goToPrevious}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Slides */}
        <div className="slides-wrapper">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={getSlideClass(index)}>
              <TestimonialCard
                name={testimonial.name}
                message={testimonial.message}
                image={testimonial.image}
                rating={testimonial.rating}
              />
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button className="carousel-button next-button" onClick={goToNext}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="dots-container">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
