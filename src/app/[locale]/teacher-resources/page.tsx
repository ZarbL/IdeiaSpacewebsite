import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';

export default async function TeacherResourcesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('teacherResources');

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/assets/space.mp4" type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
            Recursos para Professores
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
            Em breve, disponibilizaremos recursos educacionais exclusivos para professores.
          </p>
        </div>
      </div>
    </div>
  );
}
