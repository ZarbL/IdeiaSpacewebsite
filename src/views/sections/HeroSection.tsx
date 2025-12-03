import Link from 'next/link';
import { useLocale } from 'next-intl';
import { HeroContent } from '@/models/content.model';

interface HeroSectionProps {
  content: HeroContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const locale = useLocale();

  return (
    <section className="snap-start min-h-screen w-full relative text-white flex-shrink-0 flex items-end py-12 md:py-0">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={content.videoSrc} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full text-center md:text-left px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-8 md:pb-16 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
          {content.title}
        </h1>
      </div>
    </section>
  );
}
