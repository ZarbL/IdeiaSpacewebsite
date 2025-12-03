'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TechnologiesSection({ content }: { content: any }) {
  const params = useParams();
  const locale = params.locale as string;
  
  return (
    <section className="h-screen snap-start relative flex items-end justify-start overflow-hidden">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/falcon9.jpg)' }}
      />

      {/* Overlay escuro para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Conteúdo */}
      <div className="relative z-10 text-left px-8 sm:px-12 lg:px-16 pb-16 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
          {content.title}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 drop-shadow-md">
          {content.description}
        </p>
        <Link
          href={`/${locale}/technologies`}
          className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors duration-300 shadow-xl hover:shadow-2xl"
        >
          {content.buttonText}
        </Link>
      </div>
    </section>
  );
}
