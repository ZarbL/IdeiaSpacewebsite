import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import { getVideoUrl } from '@/lib/cloudinary';
import ScrollIndicator from '@/components/ScrollIndicator';
import MissionBadges from '@/components/MissionBadges';

export default async function MissionsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('missions');

  // Mission badges data
  const missions = [
    {
      id: 1,
      badgeImage: '/assets/badge1.png',
      badgeName: t('badges.mission1.name'),
      studentName: t('badges.mission1.student'),
      missionDescription: t('badges.mission1.description'),
      missionImage: '/assets/mission1.png'
    },
    {
      id: 2,
      badgeImage: '/assets/badge2.png',
      badgeName: t('badges.mission2.name'),
      studentName: t('badges.mission2.student'),
      missionDescription: t('badges.mission2.description'),
      missionImage: '/assets/mission2.png'
    },
    {
      id: 3,
      badgeImage: '/assets/badge3.png',
      badgeName: t('badges.mission3.name'),
      studentName: t('badges.mission3.student'),
      missionDescription: t('badges.mission3.description'),
      missionImage: '/assets/mission3.png'
    },
    {
      id: 4,
      badgeImage: '/assets/badge4.png',
      badgeName: t('badges.mission4.name'),
      studentName: t('badges.mission4.student'),
      missionDescription: t('badges.mission4.description'),
      missionImage: '/assets/mission4.png'
    }
  ];

  return (
    <div className="overflow-y-auto">
      {/* Block 5.1 - Hero Cover with Scroll Indicator */}
      <section className="min-h-screen w-full relative flex flex-col items-center justify-center">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('emblema.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-12 lg:px-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-100 drop-shadow-lg">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Scroll Indicator at Bottom */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center pb-8">
          <ScrollIndicator />
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Block 5.2 - Mission Development Explanation */}
      <section className="min-h-screen w-full relative flex items-center">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('space.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 md:mb-12 drop-shadow-2xl">
              {t('development.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed drop-shadow-lg">
              {t('development.description')}
            </p>
          </div>
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Block 5.3 - Mission Badges */}
      <section className="min-h-screen w-full relative flex items-center py-12">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('terranoite.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 text-center drop-shadow-2xl">
            {t('badges.title')}
          </h2>
          <MissionBadges missions={missions} />
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>
    </div>
  );
}
