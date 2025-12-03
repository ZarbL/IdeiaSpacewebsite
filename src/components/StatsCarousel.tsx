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
    },
    {
      number: '30',
      title: t('selectedStudents'),
    },
    {
      number: t('oneYear'),
      title: t('projectDuration'),
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

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
    <div className="relative w-full flex justify-center">
      {/* Keyframe animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes rotation {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `
      }} />

      {/* Card Container */}
      <div className="relative overflow-hidden" style={{ width: '280px' }}>
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
            {/* Animated Card */}
            <div 
              className="group relative cursor-pointer overflow-hidden flex items-center justify-center"
              style={{
                width: '280px',
                height: '320px',
                background: '#171717',
                boxShadow: '0px 0px 3px 1px #00000088'
              }}
            >
              {/* Rotating gradient border (hidden by default, visible on hover) */}
              <div 
                className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  width: '80px',
                  height: '360px',
                  background: 'linear-gradient(#ff2288, #387ef0)',
                  animation: 'rotation 8s infinite linear',
                  animationPlayState: 'paused'
                }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.animationPlayState = 'running';
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget as HTMLDivElement;
                  target.style.animationPlayState = 'paused';
                }}
              />
              
              {/* Inner content */}
              <div 
                className="relative z-10 flex flex-col items-center justify-center rounded-md p-5"
                style={{
                  width: '276px',
                  height: '316px',
                  background: '#171717'
                }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    width: '5px',
                    height: '50px',
                    background: 'white',
                    filter: 'blur(50px)'
                  }}
                />
                
                <h3 className="text-6xl font-bold mb-4 relative z-10" style={{ color: '#ff2288' }}>
                  {slide.number}
                </h3>
                <p className="text-xl font-semibold text-white text-center relative z-10">
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
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
        aria-label="Anterior"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-10"
        aria-label="Próximo"
      >
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6 absolute -bottom-12 left-1/2 -translate-x-1/2">
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
