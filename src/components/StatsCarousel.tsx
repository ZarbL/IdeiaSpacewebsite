'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface StatsCarouselProps {
  locale: string;
}

export default function StatsCarousel({ locale }: StatsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('services.stats');

  const slides = [
    {
      number: '500',
      title: t('initialStudents'),
      background: '/assets/carrosel1.png'
    },
    {
      number: '30',
      title: t('selectedStudents'),
      background: '/assets/carrosel2.png'
    },
    {
      number: t('oneYear'),
      title: t('projectDuration'),
      background: '/assets/carrosel3.png'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? 'opacity-100 translate-x-0' 
                : index < currentSlide 
                  ? 'opacity-0 -translate-x-full absolute inset-0' 
                  : 'opacity-0 translate-x-full absolute inset-0'
            }`}
          >
            {/* Background Image */}
            <div 
              className="relative w-full bg-cover bg-center h-64 sm:h-72 md:h-80 lg:h-96"
              style={{
                backgroundImage: `url(${slide.background})`,
              }}
            >
              {/* Light overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
                <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-3 md:mb-4" 
                    style={{ color: '#B8377D' }}>
                  {slide.number}
                </h3>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900">
                  {slide.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Anterior"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        aria-label="Próximo"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? 'w-8 h-3 bg-white' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
