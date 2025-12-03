import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import TechnologyCard from '@/components/TechnologyCard';

export default async function TechnologiesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('technologies');

  return (
    <div className="overflow-y-auto">
      {/* First Section - Hero with Video Background */}
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
            <source src="/assets/galaxyespiral.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-start justify-start px-8 md:px-16 lg:px-24 pt-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 leading-tight">
              {t('pageTitle')}
            </h1>
            
            {/* Technology Cards */}
            <div className="flex gap-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {t('kit.title')}
                </h2>
                <TechnologyCard
                  title=""
                  image="/assets/kiteducational.png"
                  description={t('kit.description')}
                />
              </div>
              
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {t('satellite.title')}
                </h2>
                <TechnologyCard
                  title=""
                  image="/assets/packetqube.png"
                  description={t('satellite.description')}
                />
              </div>
              
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {t('platform.title')}
                </h2>
                <TechnologyCard
                  title=""
                  image="/assets/MissionProgrammingTool.png"
                  description={t('platform.description')}
                />
                <a
                  href="https://ideia-spacetoweb.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-white text-black px-6 py-3 rounded-full text-base font-semibold hover:bg-gray-200 transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  {t('platform.button')}
                </a>
              </div>
              
              <div>
                <h2 className="text-xl md:text-2xl font-bold mb-4">
                  {t('deployer.title')}
                </h2>
                <TechnologyCard
                  title=""
                  image="/assets/deployer.png"
                  description={t('deployer.description')}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
