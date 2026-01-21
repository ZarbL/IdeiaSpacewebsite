import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import OptimizedVideo from '@/components/OptimizedVideo';
import ScrollIndicator from '@/components/ScrollIndicator';
import MissionBadges from '@/components/MissionBadges';
import SatelliteTracker from '@/components/SatelliteTracker';

export default async function MissionsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('missions');

  // Mission badges data
  const missions = [
    {
      id: 1,
      badgeImage: getImageUrl('missionbagde1.png'),
      badgeName: t('badges.mission1.name'),
      studentName: t('badges.mission1.student'),
      missionDescription: t('badges.mission1.description'),
      missionImage: getImageUrl('missionbagde1.png')
    },
    {
      id: 2,
      badgeImage: getImageUrl('missionbagde2.png'),
      badgeName: t('badges.mission2.name'),
      studentName: t('badges.mission2.student'),
      missionDescription: t('badges.mission2.description'),
      missionImage: getImageUrl('missionbagde2.png')
    },
    {
      id: 3,
      badgeImage: getImageUrl('missionbagde3.png'),
      badgeName: t('badges.mission3.name'),
      studentName: t('badges.mission3.student'),
      missionDescription: t('badges.mission3.description'),
      missionImage: getImageUrl('missionbagde3.png')
    },
    {
      id: 4,
      badgeImage: getImageUrl('missionbagde4.png'),
      badgeName: t('badges.mission4.name'),
      studentName: t('badges.mission4.student'),
      missionDescription: t('badges.mission4.description'),
      missionImage: getImageUrl('missionbagde4.png')
    },
    {
      id: 5,
      badgeImage: getImageUrl('missionbagde5.png'),
      badgeName: t('badges.mission5.name'),
      studentName: t('badges.mission5.student'),
      missionDescription: t('badges.mission5.description'),
      missionImage: getImageUrl('missionbagde5.png')
    }
  ];

  return (
    <div>
      {/* Block 5.1 - Hero Cover with Scroll Indicator */}
      <section className="min-h-screen w-full relative flex flex-col items-center justify-center">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <OptimizedVideo
            src={getVideoUrl('emblema.mp4')}
            className="w-full h-full object-cover"
            priority={true}
          />
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
          <OptimizedVideo
            src={getVideoUrl('space.mp4')}
            className="w-full h-full object-cover"
          />
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
      <section className="min-h-screen w-full relative flex items-center py-12" style={{ backgroundColor: '#ffffff' }}>
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-12 text-center">
            {t('badges.title')}
          </h2>
          <MissionBadges missions={missions} />
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Block 5.4 - Satellite Tracker */}
      <section className="min-h-screen w-full relative flex items-center py-16" style={{ backgroundColor: '#0a0a0a' }}>
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          <SatelliteTracker 
            title={t('tracker.title')}
            description={t('tracker.description')}
          />
        </div>
      </section>
    </div>
  );
}
