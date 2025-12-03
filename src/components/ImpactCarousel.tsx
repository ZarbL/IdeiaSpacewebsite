'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getVideoUrl } from '@/lib/cloudinary';

export default function ImpactCarousel() {
  const t = useTranslations('services.ecosystem.impact');
  
  const impactData = [
    {
      id: 1,
      number: '+1.000',
      text: t('students'),
      image: '/assets/impactocard1.png',
      color: '#4F46E5',
      isVideo: false
    },
    {
      id: 2,
      number: '+140',
      text: t('teachers'),
      image: getVideoUrl('impactocard2.MP4'),
      color: '#7C3AED',
      isVideo: true
    },
    {
      id: 3,
      number: '+8',
      text: t('satellites'),
      image: '/assets/impactocard3.png',
      color: '#F97316',
      isVideo: false
    },
    {
      id: 4,
      number: '5+',
      text: t('countries'),
      image: getVideoUrl('impactocard4.mp4'),
      color: '#10B981',
      isVideo: true
    }
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide pb-8 -mx-4 px-4">
      <div className="flex gap-6 min-w-max">
        {impactData.map((item) => (
          <div 
            key={item.id} 
            className="methodology-card-wrapper flex-shrink-0"
          >
            <div 
              className="methodology-card relative"
              style={{ '--card-color': item.color } as React.CSSProperties}
              data-description={`${item.number}\n${item.text}`}
            >
              <div className="methodology-card-front overflow-hidden rounded-[15px]">
                {/* Background Image or Video */}
                {item.isVideo ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-[15px]"
                    style={{ zIndex: 0 }}
                  >
                    <source src={item.image} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={item.image}
                    alt={item.text}
                    fill
                    className="object-cover rounded-[15px]"
                    style={{ zIndex: 0 }}
                  />
                )}
                {/* Overlay escuro para melhor legibilidade */}
                <div className="absolute inset-0 bg-black/40 rounded-[15px]" style={{ zIndex: 1 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
