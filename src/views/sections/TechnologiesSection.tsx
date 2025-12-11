'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TechnologiesSection({ content }: { content: any }) {
  const params = useParams();
  const locale = params.locale as string;
  
  return (
    <section className="min-h-screen snap-start relative flex items-center justify-center lg:justify-start overflow-hidden">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/Recursos.png)' }}
      />

      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <div className="relative z-10 text-center lg:text-left px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-2xl lg:w-auto w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg">
          {content.title}
        </h1>
        <p 
          className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 md:mb-8 drop-shadow-md leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.description }}
        />
        <Link
          href={`/${locale}/technologies`}
          className="inline-block bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg font-semibold hover:bg-gray-200 transition-colors duration-300 shadow-xl hover:shadow-2xl"
        >
          {content.buttonText}
        </Link>
      </div>
    </section>
  );
}
