import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
import { getImageUrl, getVideoUrl } from '@/lib/cloudinary';
import StatsCarousel from '@/components/StatsCarousel';
import MethodologyCarousel from '@/components/MethodologyCarousel';
import EcosystemCard from '@/components/EcosystemCard';
import ImpactCarousel from '@/components/ImpactCarousel';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import ScrollIndicator from '@/components/ScrollIndicator';
import JourneyCard from '@/components/JourneyCard';
import InfoCard from '@/components/InfoCard';

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
    },
    {
      name: t('ecosystem.testimonials.student5.name'),
      message: t('ecosystem.testimonials.student5.message'),
      image: getImageUrl('student5.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student6.name'),
      message: t('ecosystem.testimonials.student6.message'),
      image: getImageUrl('student6.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student7.name'),
      message: t('ecosystem.testimonials.student7.message'),
      image: getImageUrl('student7.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student8.name'),
      message: t('ecosystem.testimonials.student8.message'),
      image: getImageUrl('student8.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student9.name'),
      message: t('ecosystem.testimonials.student9.message'),
      image: getImageUrl('student9.png'),
      rating: 5
    },
    {
      name: t('ecosystem.testimonials.student10.name'),
      message: t('ecosystem.testimonials.student10.message'),
      image: getImageUrl('student10.png'),
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

      {/* Second Section - Video Background with Text and Card */}
      <section className="min-h-screen w-full relative bg-black flex items-center">
        {/* Separator Line at Top */}
        <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
        
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('planetaagua.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          {/* Left - Text */}
          <div className="text-white">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              {t('whySpaceChallenge.description')}
            </p>
          </div>

          {/* Right - Info Card */}
          <div className="flex justify-center lg:justify-end">
            <InfoCard
              title={t('whySpaceChallenge.cardTitle')}
              description={t('whySpaceChallenge.cardDescription')}
              image={getVideoUrl('satellite-orbit.mp4')}
            />
          </div>
        </div>

        {/* Separator Line at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Third Section - Image with Text and Carousel */}
      <section className="min-h-screen w-full relative bg-black flex flex-col justify-between py-8 md:py-12">
        {/* Image Background */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${getImageUrl('nebulus.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 h-full flex flex-col justify-between">
          {/* Text - Top Right */}
          <div className="w-full flex justify-center md:justify-end pt-8 md:pt-12 lg:pt-16">
            <div className="max-w-2xl text-white text-center md:text-right">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-bold mb-4 md:mb-6 lg:mb-8">
                {t('whatIsChallenge.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl lg:text-lg text-gray-100 leading-relaxed">
                {t('whatIsChallenge.description')}
              </p>
            </div>
          </div>

          {/* Carousel - Center Bottom */}
          <div className="flex items-end justify-center pb-8 md:pb-12 lg:pb-20 mt-auto">
            <StatsCarousel locale={locale} />
          </div>
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Fourth Section - Methodology */}
      <section id="methodology" className="min-h-screen w-full relative bg-black flex items-center py-8 md:py-12">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('metodology.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col px-4 sm:px-6 md:px-12 lg:px-24 gap-6 md:gap-12 lg:pt-12">
          {/* Title and Description */}
          <div className="max-w-3xl text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              {t('methodology.title')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
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

      {/* Fifth Section - Video Background */}
      <section className="min-h-screen w-full relative overflow-hidden flex items-center py-8 md:py-12">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={getVideoUrl('Terraespaco.mp4')} type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col justify-start px-4 sm:px-6 md:px-12 lg:px-24 py-8 md:py-12 gap-8 md:gap-12">
          {/* Top Left - Ecosystem */}
          <div className="w-full max-w-4xl">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl mb-4 md:mb-6">
              {t('ecosystem.title')}
            </h2>

            {/* Card Below Title */}
            <EcosystemCard />
          </div>

          {/* Bottom Right - Impact */}
          <div className="w-full max-w-5xl self-end">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-6 md:mb-8 text-right">
              {t('ecosystem.impact.title')}
            </h3>
            
            <ImpactCarousel />
          </div>
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Journey Section - 12 Months */}
      <section className="min-h-screen w-full relative overflow-hidden flex items-center py-12">
        {/* Background Image */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${getImageUrl('nebulus.png')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          {/* Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-2xl mb-12 text-center">
            {t('journey.title')}
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <JourneyCard
              title={t('journey.preChallenge.title')}
              months={t('journey.preChallenge.months')}
              description={t('journey.preChallenge.description')}
              color="#9B59B6"
            />
            <JourneyCard
              title={t('journey.phase1.title')}
              months={t('journey.phase1.months')}
              description={t('journey.phase1.description')}
              color="#E91E63"
            />
            <JourneyCard
              title={t('journey.phase2.title')}
              months={t('journey.phase2.months')}
              description={t('journey.phase2.description')}
              color="#E91E63"
            />
            <JourneyCard
              title={t('journey.phase3.title')}
              months={t('journey.phase3.months')}
              description={t('journey.phase3.description')}
              color="#E91E63"
            />
            <JourneyCard
              title={t('journey.postChallenge.title')}
              months={t('journey.postChallenge.months')}
              description={t('journey.postChallenge.description')}
              color="#9B59B6"
            />
          </div>
        </div>

        {/* Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Sixth Section - Testimonials */}
      <section className="min-h-screen w-full relative overflow-hidden flex flex-col py-12">
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
