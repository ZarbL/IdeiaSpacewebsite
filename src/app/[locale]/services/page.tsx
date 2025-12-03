import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
import { getVideoUrl } from '@/lib/cloudinary';
import StatsCarousel from '@/components/StatsCarousel';
import MethodologyCarousel from '@/components/MethodologyCarousel';
import EcosystemCard from '@/components/EcosystemCard';
import ImpactCarousel from '@/components/ImpactCarousel';
import TestimonialCard from '@/components/TestimonialCard';

export default async function ServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');

  return (
    <div className="overflow-y-auto">
      {/* First Section - Hero with Image Background */}
      <section 
        className="min-h-screen w-full relative flex items-center"
        style={{
          backgroundImage: 'url(/assets/homedesafioespacial.png)',
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
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed mb-6 md:mb-8">
              {t('spaceChallenge.description')}
            </p>
            <Link
              href={`#methodology`}
              className="group inline-flex items-center gap-3 hover:opacity-90 transition-opacity font-medium text-base md:text-lg"
            >
              <span className="text-white">{t('spaceChallenge.button')}</span>
              <span className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Second Section - Video Background with Text */}
      <section className="min-h-screen w-full relative bg-black flex items-center">
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
        <div className="relative z-10 w-full max-w-[1920px] mx-auto flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-24 py-12">
          <div className="max-w-3xl text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
              {t('whySpaceChallenge.title')}
            </h2>
            <div className="space-y-4 md:space-y-6 text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              <p>
                {t('whySpaceChallenge.description1')}
              </p>
              <p>
                {t('whySpaceChallenge.description2')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Third Section - Image with Text and Carousel */}
      <section className="min-h-screen w-full relative bg-black flex flex-col justify-between py-8 md:py-12">
        {/* Image Background */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: 'url(/assets/nebulus.png)',
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
      </section>

      {/* Sixth Section - Testimonials */}
      <section className="min-h-screen w-full relative overflow-hidden flex items-center py-12">
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
          <div className="max-w-6xl w-full mx-auto">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-8 md:mb-12 text-center">
              {t('ecosystem.testimonials.title')}
            </h2>

            {/* Testimonial Cards - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 justify-items-center max-w-4xl mx-auto">
              <TestimonialCard
                name={t('ecosystem.testimonials.roseno.name')}
                message={t('ecosystem.testimonials.roseno.message')}
                image="/assets/RosenofromIdeiaSite.png"
                rating={5}
              />
              <TestimonialCard
                name={t('ecosystem.testimonials.mariana.name')}
                message={t('ecosystem.testimonials.mariana.message')}
                image="/assets/MarianafromIdeiaSite.png"
                rating={5}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
