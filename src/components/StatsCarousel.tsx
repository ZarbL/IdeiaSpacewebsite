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
    <div className="relative w-full max-w-[800px] mx-auto overflow-hidden px-16 py-10">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-3xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-full bg-white rounded-3xl p-12 text-center"
              style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
            >
              {/* Number in Pink Circle */}
              <div 
                className="flex items-center justify-center mx-auto mb-8"
                style={{
                  width: '120px',
                  height: '120px',
                  background: '#e91e63',
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
                }}
              >
                <span className="text-white text-3xl font-bold px-2">
                  {slide.number}
                </span>
              </div>

              {/* Title */}
              <p className="text-2xl font-bold text-gray-800 leading-snug max-w-xl mx-auto">
                {slide.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-[#e91e63] text-[#e91e63] rounded-full flex items-center justify-center transition-all hover:bg-[#e91e63] hover:text-white hover:scale-110 z-10 text-3xl"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        aria-label="Anterior"
      >
        ‹
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-[#e91e63] text-[#e91e63] rounded-full flex items-center justify-center transition-all hover:bg-[#e91e63] hover:text-white hover:scale-110 z-10 text-3xl"
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
        aria-label="Próximo"
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-3 mt-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full border-none cursor-pointer p-0 ${
              index === currentSlide 
                ? 'w-8 h-3 bg-[#e91e63] rounded-md' 
                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
