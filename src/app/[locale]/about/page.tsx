import {getTranslations} from 'next-intl/server';
import {setRequestLocale} from 'next-intl/server';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import OptimizedVideo from '@/components/OptimizedVideo';
import AboutCarousel from '@/components/AboutCarousel';
import BenefitsCarousel from '@/components/BenefitsCarousel';
import HistoryCarousel from '@/components/HistoryCarousel';
import MVVCarousel from '@/components/MVVCarousel';
import PartnersCarousel from '@/components/PartnersCarousel';
import LeadershipCard from '@/components/LeadershipCard';
import SocialMediaCard from '@/components/SocialMediaCard';

export default async function AboutPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tLeadership = await getTranslations('leadership');

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Video Background */}
      <OptimizedVideo
        src={getVideoUrl('space.mp4')}
        className="absolute top-0 left-0 w-full h-full object-cover"
        priority={true}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content - Scroll Sections */}
      <div className="relative z-10 w-full snap-y snap-mandatory overflow-y-scroll h-screen">
        {/* Section 1 - Value Proposition */}
        <section className="h-screen w-full snap-start flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
            <div className="flex flex-col justify-center py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
              <div className="text-left text-white">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
                  {t('title')}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed">
                  {t('description')}
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <BenefitsCarousel />
            </div>
          </div>
        </section>

        {/* Section 2 - History */}
        <section className="h-screen w-full snap-start flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
            <div className="flex flex-col justify-center py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
              <div className="text-left text-white">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
                  {t('historyTitle')}
                </h2>
                <p 
                  className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('historyDescription') }}
                />
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <HistoryCarousel />
            </div>
          </div>
        </section>
        {/* Section 3 - Mission, Vision and Values */}
        <section className="h-screen w-full snap-start flex items-center relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
            <div className="flex flex-col justify-center py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-24">
              <div className="text-left text-white">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
                  {t('mvvTitle')}
                </h2>
                <p 
                  className="text-base sm:text-lg md:text-xl text-gray-100 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('mvvContent') }}
                />
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <MVVCarousel />
            </div>
          </div>
        </section>

        {/* Section 4 - Partners */}
        <section className="min-h-screen w-full snap-start flex items-center relative z-10 py-8 md:py-0">
          <div className="w-full flex flex-col items-center justify-center py-12 md:py-16 px-2 sm:px-4 md:px-12 lg:px-16 xl:px-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 md:mb-12 lg:mb-16 text-white text-center">
              {t('partnersTitle')}
            </h2>
            <div className="w-full relative z-10 max-w-full overflow-hidden">
              <PartnersCarousel />
            </div>
          </div>
        </section>

        {/* Section 5 - Leadership */}
        <section className="h-screen w-full snap-start relative z-10">
          {/* Content */}
          <div className="h-full flex flex-col justify-start px-4 sm:px-6 md:px-12 lg:px-24 py-8 md:py-12">
            <div className="max-w-4xl mb-8 md:mb-12 mx-auto text-center mt-6 md:mt-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-4 md:mb-6 px-4">
                {t('leadershipTitle')}
              </h2>
            </div>

            {/* Cards Container - Responsive: horizontal scroll on mobile, grid on larger screens */}
            <div className="w-full flex-1 overflow-visible">
              {/* Mobile: Horizontal Scroll */}
              <div className="lg:hidden w-full overflow-x-auto scrollbar-hide pb-8">
                <div className="flex gap-4 px-4 min-w-max">
                  <LeadershipCard
                    name="Leonardo Souza"
                    role={tLeadership('ceo')}
                    image={getImageUrl('LiderLeonardo.png')}
                    socialLinks={{
                      linkedin: "#",
                      instagram: "https://www.instagram.com/leojulio23/"
                    }}
                  />
                  <LeadershipCard
                    name="Victor Batista"
                    role={tLeadership('coo')}
                    image={getImageUrl('LiderVictorBatista.png')}
                    socialLinks={{
                      linkedin: "#",
                      instagram: "https://www.instagram.com/victor_ribeiro22/"
                    }}
                  />
                  <LeadershipCard
                    name="Matheus Six"
                    role={tLeadership('cpo')}
                    image={getImageUrl('LiderMatheus.png')}
                    socialLinks={{
                      linkedin: "#",
                      instagram: "https://www.instagram.com/matheussix/"
                    }}
                  />
                  <LeadershipCard
                    name="Rafael Paiva"
                    role={tLeadership('cto')}
                    image={getImageUrl('LiderRafael.png')}
                    socialLinks={{
                      linkedin: "#",
                      instagram: "https://www.instagram.com/paiva_96/"
                    }}
                  />
                </div>
              </div>
              
              {/* Desktop: Grid Layout */}
              <div className="hidden lg:grid grid-cols-4 gap-6 xl:gap-8 justify-items-center items-start w-full max-w-7xl mx-auto px-4 overflow-visible">
                <LeadershipCard
                  name="Leonardo Souza"
                  role={tLeadership('ceo')}
                  image={getImageUrl('LiderLeonardo.png')}
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/leojulio23/"
                  }}
                />
                <LeadershipCard
                  name="Victor Batista"
                  role={tLeadership('coo')}
                  image={getImageUrl('LiderVictorBatista.png')}
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/victor_ribeiro22/"
                  }}
                />
                <LeadershipCard
                  name="Matheus Six"
                  role={tLeadership('cpo')}
                  image={getImageUrl('LiderMatheus.png')}
                  socialLinks={{
                    linkedin: "#",
                    instagram: "https://www.instagram.com/matheussix/"
                  }}
                />
                <LeadershipCard
                  name="Rafael Paiva"
                  role={tLeadership('cto')}
                  image={getImageUrl('LiderRafael.png')}
                  socialLinks={{
                    linkedin: "#",
                      instagram: "https://www.instagram.com/paiva_96/"
                  }}
                />
              </div>
            </div>

            {/* Social Media Card - Below Leadership Cards */}
            <div className="flex justify-center mt-8 md:mt-12 pb-8">
              <SocialMediaCard />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
