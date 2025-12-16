import { HomeController } from '@/controllers/home.controller';
import HeroSection from '@/views/sections/HeroSection';
import ChallengeSection from '@/views/sections/ChallengeSection';
import MissionsSection from '@/views/sections/MissionsSection';
import TechnologiesSection from '@/views/sections/TechnologiesSection';
import IdeiaToSpaceSection from '@/views/sections/IdeiaToSpaceSection';
import StatsCounter from '@/components/StatsCounter';
import LeadershipCard from '@/components/LeadershipCard';
import SocialMediaCard from '@/components/SocialMediaCard';
import ContactForm from '@/components/ContactForm';
import {getTranslations} from 'next-intl/server';
import {setRequestLocale} from 'next-intl/server';
import { getVideoUrl } from '@/lib/cloudinary';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations();
  const pageContent = HomeController.getPageContent(t);

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <HeroSection content={pageContent.hero} />
      
      {/* Stats Counter Section */}
      <StatsCounter 
        title={t('stats.title')}
        subtitle={t('stats.subtitle')}
        stats={[
          { number: t('stats.satellites'), label: t('stats.satellitesLabel'), size: 'medium' },
          { number: t('stats.students'), label: t('stats.studentsLabel'), size: 'large' },
          { number: t('stats.countries'), label: t('stats.countriesLabel'), size: 'medium' }
        ]}
      />
      
      {/* Ideia to Space Section */}
      <IdeiaToSpaceSection 
        title={t('ideiaToSpace.title')}
        description={t('ideiaToSpace.description')}
      />
      
      <ChallengeSection content={pageContent.challenge} />
      
      {/* Missions Section */}
      <MissionsSection 
        title={t('missions.title')}
        description={t('missions.description')}
        buttonText={t('missions.button')}
      />
      
      <TechnologiesSection content={pageContent.technologies} />

      {/* Contact Section */}
      <section id="contact" className="min-h-screen w-full relative overflow-hidden snap-start bg-black flex items-center py-12 pt-32">
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl text-center mb-8 md:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 md:mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed mb-8 md:mb-12">
              {t('contact.description')}
            </p>
            
            {/* Social Media Buttons */}
            <div className="flex justify-center mb-8 md:mb-12">
              <SocialMediaCard />
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="w-full max-w-2xl px-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
