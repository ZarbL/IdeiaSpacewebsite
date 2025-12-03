import { HomeController } from '@/controllers/home.controller';
import HeroSection from '@/views/sections/HeroSection';
import ChallengeSection from '@/views/sections/ChallengeSection';
import TechnologiesSection from '@/views/sections/TechnologiesSection';
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
      <ChallengeSection content={pageContent.challenge} />
      <TechnologiesSection content={pageContent.technologies} />
      
      {/* Leadership Section */}
      <section className="h-screen w-full relative overflow-hidden snap-start">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('nossalideranca.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-start px-4 sm:px-6 md:px-12 lg:px-24 py-8 md:py-12">
          <div className="max-w-4xl mb-8 md:mb-12 mx-auto text-center mt-6 md:mt-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 md:mb-6 px-4">
              {t('leadership.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed px-4">
              {t('leadership.description')}
            </p>
          </div>

          {/* Cards Container - Responsive: horizontal scroll on mobile, grid on larger screens */}
          <div className="w-full flex-1 overflow-hidden">
            {/* Mobile: Horizontal Scroll */}
            <div className="lg:hidden w-full overflow-x-auto scrollbar-hide pb-8">
              <div className="flex gap-4 px-4 min-w-max">
                <LeadershipCard
                  name="Leonardo Souza"
                  role={t('leadership.ceo')}
                  image="/assets/LiderLeonardo.png"
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/leojulio23/"
                  }}
                />
                <LeadershipCard
                  name="Victor Batista"
                  role={t('leadership.coo')}
                  image="/assets/LiderVictorBatista.png"
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/victor_ribeiro22/"
                  }}
                />
                <LeadershipCard
                  name="Matheus Six"
                  role={t('leadership.cpo')}
                  image="/assets/LiderMatheus.png"
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/matheussix/"
                  }}
                />
                <LeadershipCard
                  name="Rafael Paiva"
                  role={t('leadership.cto')}
                  image="/assets/LiderRafael.png"
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/paiva_96/"
                  }}
                />
              </div>
            </div>
            
            {/* Desktop: Grid Layout */}
            <div className="hidden lg:grid grid-cols-4 gap-4 md:gap-6 justify-items-center items-center w-full max-w-7xl mx-auto px-4">
              <LeadershipCard
                name="Leonardo Souza"
                role={t('leadership.ceo')}
                image="/assets/LiderLeonardo.png"
                socialLinks={{
                  linkedin: "#",
                  instagram: "https://www.instagram.com/leojulio23/"
                }}
              />
              <LeadershipCard
                name="Victor Batista"
                role={t('leadership.coo')}
                image="/assets/LiderVictorBatista.png"
                socialLinks={{
                  linkedin: "#",
                  instagram: "https://www.instagram.com/victor_ribeiro22/"
                }}
              />
              <LeadershipCard
                name="Matheus Six"
                role={t('leadership.cpo')}
                image="/assets/LiderMatheus.png"
                socialLinks={{
                  linkedin: "#",
                  instagram: "https://www.instagram.com/matheussix/"
                }}
              />
              <LeadershipCard
                name="Rafael Paiva"
                role={t('leadership.cto')}
                image="/assets/LiderRafael.png"
                socialLinks={{
                  linkedin: "#",
                  instagram: "https://www.instagram.com/paiva_96/"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen w-full relative overflow-hidden snap-start bg-black flex items-center py-12">
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl text-center mb-8 md:mb-12">
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-white mb-6 md:mb-8">
              {t('contact.subtitle')}
            </p>
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
