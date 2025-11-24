import Link from 'next/link';
import { useLocale } from 'next-intl';
import { CTAContent } from '@/models/content.model';

interface CTASectionProps {
  content: CTAContent;
}

export default function CTASection({ content }: CTASectionProps) {
  const locale = useLocale();

  return (
    <section className="snap-start h-screen w-full bg-blue-600 text-white relative flex-shrink-0">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            {content.title}
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100">
            {content.subtitle}
          </p>
          <Link
            href={`/${locale}${content.buttonLink}`}
            className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm sm:text-base"
          >
            {content.buttonText}
          </Link>
        </div>
      </div>
    </section>
  );
}
