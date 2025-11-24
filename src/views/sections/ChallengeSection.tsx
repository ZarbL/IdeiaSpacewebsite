import Link from 'next/link';
import { useLocale } from 'next-intl';
import { ChallengeContent } from '@/models/content.model';

interface ChallengeSectionProps {
  content: ChallengeContent;
}

export default function ChallengeSection({ content }: ChallengeSectionProps) {
  const locale = useLocale();

  return (
    <section className="snap-start h-screen w-full bg-white relative flex-shrink-0">
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
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-end z-10">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 text-right">
          <div className="max-w-4xl ml-auto">
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 tracking-wide">
              {content.title}
            </h2>
            <div className="flex items-center gap-4 justify-end">
              <Link
                href={`/${locale}${content.buttonLink}`}
                className="group flex items-center gap-3 hover:opacity-90 transition-opacity font-medium text-lg"
              >
                <span className="text-white">{content.buttonText}</span>
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg">
                  <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
