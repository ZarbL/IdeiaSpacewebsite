import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ChallengeContent } from '@/models/content.model';
import OptimizedVideo from '@/components/OptimizedVideo';

interface ChallengeSectionProps {
  content: ChallengeContent;
}

export default function ChallengeSection({ content }: ChallengeSectionProps) {
  const locale = useLocale();

  return (
    <section className="snap-start min-h-screen w-full bg-white relative flex-shrink-0 flex items-center">
      {/* Video Background */}
      <OptimizedVideo
        src={content.videoSrc}
        className="absolute top-0 left-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="max-w-4xl text-center md:text-left flex flex-col items-center md:items-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-wide">
            {content.title}
          </h2>
          <p 
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 leading-relaxed mb-6 sm:mb-8 drop-shadow-lg max-w-full lg:max-w-[600px] xl:max-w-[700px]"
            dangerouslySetInnerHTML={{ __html: content.description }}
          />
          <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start">
            <Link
              href={`/${locale}${content.buttonLink}`}
              className="group inline-flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity font-medium text-base md:text-lg"
            >
              <span className="text-white">{content.buttonText}</span>
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
