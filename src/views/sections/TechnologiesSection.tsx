'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getImageUrl } from '@/lib/cloudinary';

export default function TechnologiesSection({ content }: { content: any }) {
  const params = useParams();
  const locale = params.locale as string;
  
  return (
    <section className="min-h-screen snap-start relative flex items-center justify-center lg:justify-start overflow-hidden">
      {/* Imagem de fundo */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${getImageUrl('Recursos.png')})` }}
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
          className="inline-flex items-center gap-4 text-white pl-0 pr-0 py-0 text-base md:text-lg font-semibold hover:opacity-90 transition-opacity duration-300"
          style={{ 
            textDecoration: 'none', 
            border: 'none', 
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <span className="drop-shadow-lg">{content.buttonText}</span>
          <div className="flex items-center justify-center bg-white rounded-full w-10 h-10 md:w-12 md:h-12 flex-shrink-0" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </Link>
      </div>
    </section>
  );
}
