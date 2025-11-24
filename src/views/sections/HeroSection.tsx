import Link from 'next/link';
import { useLocale } from 'next-intl';
import { HeroContent } from '@/models/content.model';

interface HeroSectionProps {
  content: HeroContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const locale = useLocale();

  return (
    <section className="snap-start h-screen w-full relative text-white flex-shrink-0">
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
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
              {content.title}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200 max-w-2xl">
              {content.subtitle}
            </p>
            {/* Buttons only visible on desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={`/${locale}${content.buttonLink}`}
                className="group flex items-center gap-3 hover:opacity-90 transition-opacity font-medium text-lg"
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg">
                  <svg className="w-5 h-5 text-blue-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                <span className="text-white">{content.buttonText}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
