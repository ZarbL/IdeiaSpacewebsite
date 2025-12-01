import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';
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
        className="h-screen w-full relative"
        style={{
          backgroundImage: 'url(/assets/homedesafioespacial.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="h-screen w-full flex items-center justify-end px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('spaceChallenge.title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8">
              {t('spaceChallenge.description')}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="group flex items-center gap-3 hover:opacity-90 transition-opacity font-medium text-lg"
            >
              <span className="text-white">{t('spaceChallenge.button')}</span>
              <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-gray-100 transition-colors shadow-lg">
                <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Second Section - Video Background with Text */}
      <section className="h-screen w-full relative bg-black">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/planetaagua.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16 lg:px-24 z-10">
          <div className="max-w-3xl text-white">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">
              {t('whySpaceChallenge.title')}
            </h2>
            <div className="space-y-6 text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
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
      <section className="h-screen w-full relative bg-black">
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
        <div className="absolute inset-0 px-8 md:px-16 lg:px-24 z-10">
          {/* Text - Top Right */}
          <div className="absolute top-8 md:top-12 lg:top-16 right-8 md:right-16 lg:right-24 max-w-2xl text-white text-right">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8">
              {t('whatIsChallenge.title')}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              {t('whatIsChallenge.description')}
            </p>
          </div>

          {/* Carousel - Center Bottom */}
          <div className="h-full flex items-end justify-center pb-12 md:pb-16 lg:pb-20">
            <StatsCarousel locale={locale} />
          </div>
        </div>
      </section>

      {/* Fourth Section - Methodology */}
      <section className="h-screen w-full relative bg-black">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/metodology.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col px-8 md:px-16 lg:px-24 z-10 pt-12">
          {/* Title and Description */}
          <div className="max-w-3xl text-white mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {t('methodology.title')}
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              {t('methodology.description')}
            </p>
          </div>

          {/* Methodology Carousel */}
          <div className="flex-1 flex items-center">
            <MethodologyCarousel />
          </div>
        </div>
      </section>

      {/* Fifth Section - Video Background */}
      <section className="h-screen w-full relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/Terraespaco.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-start px-8 md:px-16 lg:px-24 py-12 gap-12">
          {/* Top Left - Ecosystem */}
          <div className="max-w-4xl">
            {/* Title */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-2xl mb-6">
              {t('ecosystem.title')}
            </h2>

            {/* Card Below Title */}
            <EcosystemCard />
          </div>

          {/* Bottom Right - Impact */}
          <div className="self-end max-w-5xl">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-8 text-right">
              {t('ecosystem.impact.title')}
            </h3>
            
            <ImpactCarousel />
          </div>
        </div>
      </section>

      {/* Sixth Section - Testimonials */}
      <section className="h-screen w-full relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/terranoite.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-16 lg:px-24 py-12">
          <div className="max-w-6xl w-full">
            {/* Title */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl mb-12 text-center">
              {t('ecosystem.testimonials.title')}
            </h2>

            {/* Testimonial Cards - Centered */}
            <div className="flex items-center justify-center gap-12">
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
