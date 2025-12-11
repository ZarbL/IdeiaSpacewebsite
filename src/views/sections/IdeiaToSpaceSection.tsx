'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { getImageUrl } from '@/lib/cloudinary';

interface IdeiaToSpaceSectionProps {
  title: string;
  description: string;
}

export default function IdeiaToSpaceSection({ title, description }: IdeiaToSpaceSectionProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleWidth, setTitleWidth] = useState<number>(0);
  const locale = useLocale();
  const t = useTranslations('hero');

  useEffect(() => {
    const updateWidth = () => {
      if (titleRef.current) {
        setTitleWidth(titleRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [title]);

  return (
    <section className="h-screen w-full relative overflow-hidden snap-start flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={getImageUrl('falcon9.jpg')}
          alt="Falcon 9 Launch"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center lg:justify-start px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
        {/* Text Container - Centered on mobile, left-aligned on desktop */}
        <div className="w-full lg:w-auto text-center lg:text-left">
          <h2 
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 lg:mb-6 drop-shadow-2xl"
          >
            {title}
          </h2>
          <p 
            className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-gray-100 leading-relaxed drop-shadow-lg mx-auto lg:mx-0 mb-6 md:mb-8"
            style={{ maxWidth: titleWidth > 0 ? `${titleWidth}px` : '100%' }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <div className="flex items-center gap-3 md:gap-4 justify-center lg:justify-start">
            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity font-medium text-base md:text-lg"
            >
              <span className="text-white">{t('aboutButton')}</span>
              <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
