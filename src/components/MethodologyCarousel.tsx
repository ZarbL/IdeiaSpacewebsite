'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function MethodologyCarousel() {
  const t = useTranslations('services.methodology.steps');
  
  const steps = [
    {
      number: '01',
      titleKey: 'conceive.title',
      descriptionKey: 'conceive.description',
      color: '#4F46E5', // Indigo
      image: '/assets/card1.png'
    },
    {
      number: '02',
      titleKey: 'design.title',
      descriptionKey: 'design.description',
      color: '#7C3AED', // Purple
      image: '/assets/card2.png'
    },
    {
      number: '03',
      titleKey: 'build.title',
      descriptionKey: 'build.description',
      color: '#F97316', // Orange
      image: '/assets/card3.png'
    },
    {
      number: '04',
      titleKey: 'launch.title',
      descriptionKey: 'launch.description',
      color: '#10B981', // Green
      image: '/assets/card4.jpg'
    },
    {
      number: '05',
      titleKey: 'apply.title',
      descriptionKey: 'apply.description',
      color: '#06B6D4', // Cyan
      image: '/assets/card5.jpg'
    }
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide pb-8">
      <div className="flex gap-6 px-4 min-w-max">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="methodology-card-wrapper"
          >
            <div 
              className="methodology-card"
              style={{ '--card-color': step.color } as React.CSSProperties}
              data-description={t(step.descriptionKey)}
            >
                <div className="methodology-card-front">
                {/* Background Image */}
                <Image
                  src={step.image}
                  alt={t(step.titleKey)}
                  fill
                  className="object-cover"
                  style={{ zIndex: 0 }}
                />                {/* Overlay escuro para melhor legibilidade */}
                <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }} />
                
                {/* Animação de planetas apenas no card 5 */}
                {index === 4 && (
                  <div className="planets">
                    <div id="planet"></div>
                    <div id="star"></div>
                    <div id="starShadow"></div>
                    <div id="blackHoleDisk2"></div>
                    <div id="blackHole"></div>
                    <div id="blackHoleDisk1"></div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 text-white/90 text-5xl font-bold z-10">
                  {step.number}
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <h3 className="text-white text-2xl font-bold">
                    {t(step.titleKey)}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

