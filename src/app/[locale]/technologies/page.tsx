import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import { getVideoUrl, getImageUrl } from '@/lib/cloudinary';
import ResourceCard from '@/components/ResourceCard';
import ScrollIndicator from '@/components/ScrollIndicator';

export default async function TechnologiesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('technologies');

  return (
    <div className="overflow-y-auto bg-white">
      {/* Cover Section */}
      <section className="h-screen w-full relative overflow-hidden flex flex-col">
        {/* Background Image */}
        <div 
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `url(${getImageUrl('falcon9.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            {t('resources.title')}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-3xl">
            {t('resources.subtitle')}
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="relative z-10 pb-8">
          <ScrollIndicator />
        </div>

        {/* Pink Separator Line */}
        <div className="absolute bottom-0 left-0 w-full h-[4px] bg-gradient-to-r from-transparent via-[#e80074] to-transparent z-10" />
      </section>

      {/* Resources Grid Section */}
      <section className="min-h-screen w-full py-16 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
            {t('resources.sectionTitle')}
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResourceCard
              title={t('resources.edusat.title')}
              description={t('resources.edusat.description')}
              image={getImageUrl('kiteducational.png')}
              link="/edusat"
            />
            
            <ResourceCard
              title={t('resources.orbital.title')}
              description={t('resources.orbital.description')}
              image={getImageUrl('packetqube.png')}
              link="/orbital"
            />
            
            <ResourceCard
              title={t('resources.programmingTool.title')}
              description={t('resources.programmingTool.description')}
              image={getImageUrl('MissionProgrammingTool.png')}
              link="https://ideia-spacetoweb.vercel.app/"
            />
            
            <ResourceCard
              title={t('resources.methodology.title')}
              description={t('resources.methodology.description')}
              image={getImageUrl('card1.png')}
              link="/methodology"
            />
            
            <ResourceCard
              title={t('resources.teacherTraining.title')}
              description={t('resources.teacherTraining.description')}
              image={getImageUrl('card2.png')}
              link="/training"
            />
            
            <ResourceCard
              title={t('resources.constellation.title')}
              description={t('resources.constellation.description')}
              image={getImageUrl('card3.png')}
              link="/constellation"
            />
            
            <ResourceCard
              title={t('resources.rover.title')}
              description={t('resources.rover.description')}
              image={getImageUrl('card4.jpg')}
              isWorkInProgress={true}
            />
            
            <ResourceCard
              title={t('resources.spaceLearning.title')}
              description={t('resources.spaceLearning.description')}
              image={getImageUrl('card5.jpg')}
              isWorkInProgress={true}
            />
            
            <ResourceCard
              title={t('resources.flatsat.title')}
              description={t('resources.flatsat.description')}
              image={getImageUrl('carrosel1.png')}
              isWorkInProgress={true}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
