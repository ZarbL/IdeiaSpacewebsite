import { HomeController } from '@/controllers/home.controller';
import HeroSection from '@/views/sections/HeroSection';
import ChallengeSection from '@/views/sections/ChallengeSection';
import CTASection from '@/views/sections/CTASection';
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
      <CTASection content={pageContent.cta} />
    </div>
  );
}
