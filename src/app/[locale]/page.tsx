import { HomeController } from '@/controllers/home.controller';
import HeroSection from '@/views/sections/HeroSection';
import ChallengeSection from '@/views/sections/ChallengeSection';
import TechnologiesSection from '@/views/sections/TechnologiesSection';
import LeadershipCard from '@/components/LeadershipCard';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactForm from '@/components/ContactForm';
import {getTranslations} from 'next-intl/server';
import {setRequestLocale} from 'next-intl/server';

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
            <source src="/assets/nossalideranca.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-start px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-4xl mb-12 mx-auto text-center mt-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-6">
              {t('leadership.title')}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              {t('leadership.description')}
            </p>
          </div>

          {/* Cards Container - 4 cards side by side */}
          <div className="flex gap-6 justify-center items-center flex-1">
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="h-screen w-full relative overflow-hidden snap-start bg-black">
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-start items-center px-8 md:px-16 lg:px-24 py-24 overflow-y-auto">
          <div className="max-w-4xl text-center mb-12">
            <p className="text-2xl md:text-3xl lg:text-4xl text-white mb-8">
              {t('contact.subtitle')}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-6">
              {t('contact.title')}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed mb-8">
              {t('contact.description')}
            </p>
            
            {/* WhatsApp Button */}
            <div className="flex justify-center">
              <WhatsAppButton phoneNumber="5561991983152" message={t('contact.form.heading')} />
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="mt-16 max-w-2xl mx-auto w-full px-4 pb-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
