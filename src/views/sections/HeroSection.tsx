import { HeroContent } from '@/models/content.model';
import SatelliteBackground from '@/components/satellite/SatelliteBackground';

interface HeroSectionProps {
  content: HeroContent;
}

export default function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="snap-start min-h-screen w-full relative text-white flex-shrink-0 flex items-end py-12 md:py-0">
      {/* 3D Satellite Background */}
      <SatelliteBackground />

      {/* Overlay — mantém o título legível sobre a cena */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full text-center md:text-left px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24 pb-8 md:pb-16 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
          {content.title}
        </h1>
      </div>
    </section>
  );
}
