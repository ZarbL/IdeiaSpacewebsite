import SocialMediaCard from '@/components/SocialMediaCard';
import {getTranslations} from 'next-intl/server';
import {setRequestLocale} from 'next-intl/server';
import { getVideoUrl } from '@/lib/cloudinary';

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={getVideoUrl('space.mp4')} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col py-12 md:py-16">
        {/* Title at top left */}
        <div className="px-4 sm:px-6 md:px-12 lg:px-24 mb-8 md:mb-12">
          <div className="max-w-3xl text-left text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
              {t('title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              {t('description')}
            </p>
          </div>
        </div>
        
        {/* Social Media Card at center */}
        <div className="flex-1 flex items-center justify-center px-4">
          <SocialMediaCard />
        </div>
      </div>
    </div>
  );
}
