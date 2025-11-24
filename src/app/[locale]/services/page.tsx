import {setRequestLocale} from 'next-intl/server';
import {getTranslations} from 'next-intl/server';
import Link from 'next/link';

export default async function ServicesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services.spaceChallenge');

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
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed mb-8">
              {t('description')}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="group flex items-center gap-3 hover:opacity-90 transition-opacity font-medium text-lg"
            >
              <span className="text-white">{t('button')}</span>
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
              Por que um Desafio Espacial?
            </h2>
            <div className="space-y-6 text-lg md:text-xl lg:text-2xl text-gray-100 leading-relaxed">
              <p>
                A educação brasileira apresenta baixo desempenho em áreas de STEM (Ciência, Tecnologia, Engenharia e Matemática). Ao mesmo tempo, o setor espacial está em expansão e enfrenta uma ausência de profissionais qualificados.
              </p>
              <p>
                Acreditamos que o fascínio pelo espaço pode ser a fagulha para uma experiência de aprendizado engajadora. Usamos a missão espacial como uma ferramenta para capacitar estudantes para a economia do futuro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
