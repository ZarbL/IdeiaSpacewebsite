import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import OptimizedVideo from '@/components/OptimizedVideo';
import StatsCarousel from '@/components/StatsCarousel';
import MethodologyCarousel from '@/components/MethodologyCarousel';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ScrollIndicator from '@/components/ScrollIndicator';
import PhasesCarousel from '@/components/PhasesCarousel';

export default async function ServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  const testimonials = [
    {
      name: t('ecosystem.testimonials.roseno.name'),
      message: t('ecosystem.testimonials.roseno.message'),
      image: getImageUrl('RosenofromIdeiaSite.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.mariana.name'),
      message: t('ecosystem.testimonials.mariana.message'),
      image: getImageUrl('MarianafromIdeiaSite.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student3.name'),
      message: t('ecosystem.testimonials.student3.message'),
      image: getImageUrl('student3.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student4.name'),
      message: t('ecosystem.testimonials.student4.message'),
      image: getImageUrl('student4.png'),
      rating: 5
    }
  ];

  return (
    <div className="overflow-y-auto">
      {/* First Section - Hero with Image Background */}
      <section 
        className="min-h-screen w-full relative flex items-center"
        style={{
          backgroundImage: `url(${getImageUrl('transporter15.png')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-center md:justify-end px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          <div className="max-w-2xl text-white text-center md:text-right">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              {t('spaceChallenge.title')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              {t('spaceChallenge.description')}
            </p>
          </div>
        </div>

        {/* Separator Line with Scroll Indicator */}
        <div className="absolute bottom-0 left-0 w-full flex flex-col items-center">
          <ScrollIndicator />
          <div className="w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent" />
        </div>
      </section>

      {/* Second Section - Text and Carousel */}
      <section className="min-h-screen w-full relative flex items-center" style={{ backgroundColor: '#f2f2f7' }}>
        {/* Separator Line at Top */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          {/* Left - Text */}
          <div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed">
              {t('whySpaceChallenge.description')}
            </p>
          </div>

          {/* Right - Stats Carousel */}
          <div className="flex justify-center lg:justify-end">
            <StatsCarousel locale={locale} />
          </div>
        </div>

        {/* Separator Line at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* How It Works Section */}
      <section className="min-h-screen w-full relative flex items-center py-12 md:py-16" style={{ backgroundColor: '#f2f2f7' }}>
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
          {/* Title and Description */}
          <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 text-gray-900">
              {t('howItWorks.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed">
              {t('howItWorks.description')}
            </p>
          </div>

          {/* Phases Carousel */}
          <PhasesCarousel 
            phases={[
              {
                number: 1,
                title: t('howItWorks.phase1.title'),
                description: t('howItWorks.phase1.description')
              },
              {
                number: 2,
                title: t('howItWorks.phase2.title'),
                description: t('howItWorks.phase2.description')
              },
              {
                number: 3,
                title: t('howItWorks.phase3.title'),
                description: t('howItWorks.phase3.description')
              }
            ]}
          />
        </div>

        {/* Separator Line at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Fourth Section - Methodology */}
      <section id="methodology" className="min-h-screen w-full relative flex items-center py-8 md:py-12" style={{ backgroundColor: '#f2f2f7' }}>
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col px-4 sm:px-6 md:px-12 lg:px-24 gap-6 md:gap-12 lg:pt-12">
          {/* Title and Description */}
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-gray-900">
              {t('methodology.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed">
              {t('methodology.description')}
            </p>
          </div>

          {/* Methodology Carousel */}
          <div className="w-full">
            <MethodologyCarousel />
          </div>
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Fifth Section - Testimonials */}
      <section className="min-h-screen w-full relative overflow-hidden flex flex-col py-12">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <OptimizedVideo
            src={getVideoUrl('terranoite.mp4')}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Title at Top */}
        <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-24 pt-12 md:pt-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl text-center">
            {t('ecosystem.testimonials.title')}
          </h2>
        </div>

        {/* Carousel Centered */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24">
          <div className="w-full max-w-6xl">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>
    </div>
  );
}
