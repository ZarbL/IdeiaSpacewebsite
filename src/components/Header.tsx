'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { getCloudinaryImageUrl, cloudinaryAssets } from '@/lib/cloudinary';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
    setIsLangOpen(false);
  };

  const languages = [
    { code: 'en', flag: '🇺🇸', name: 'English' },
    { code: 'pt', flag: '🇧🇷', name: 'Português' },
    { code: 'es', flag: '🇪🇸', name: 'Español' },
  ];

  const currentLang = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image 
              src={
                process.env.NEXT_PUBLIC_USE_CLOUDINARY === 'true'
                  ? 'https://res.cloudinary.com/dgyueliom/image/upload/v1764733508/ideiaspace/images/vetorizada.png'
                  : '/assets/vetorizada.png'
              }
              alt="IdeiaSpace" 
              width={300}
              height={100}
              className="h-14 sm:h-16 md:h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${locale}`}
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              {t('home')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              {t('about')}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="text-white hover:text-gray-300 transition-colors font-medium"
            >
              {t('services')}
            </Link>

            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-medium"
              >
                <span className="text-2xl">{currentLang.flag}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 bg-black/40 backdrop-blur-md rounded-lg shadow-lg py-2 min-w-[160px] border border-white/10">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-white/20 transition-colors ${
                        locale === lang.code ? 'bg-white/20 text-white font-semibold' : 'text-white'
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#contact"
              className="bg-white text-blue-900 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              {t('contact')}
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-300 p-2"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
            <div className="flex flex-col">
              <Link
                href={`/${locale}`}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-4 text-gray-900 hover:bg-blue-50 transition-colors font-medium border-b border-gray-100"
              >
                {t('home')}
              </Link>
              <Link
                href={`/${locale}/about`}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-4 text-gray-900 hover:bg-blue-50 transition-colors font-medium border-b border-gray-100"
              >
                {t('about')}
              </Link>
              <Link
                href={`/${locale}/services`}
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-4 text-gray-900 hover:bg-blue-50 transition-colors font-medium border-b border-gray-100"
              >
              {t('services')}
            </Link>
              
            {/* Language Switcher Mobile */}
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Idioma / Language</p>
              <div className="flex flex-col gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setIsMenuOpen(false); }}
                    className={`px-4 py-3 rounded flex items-center gap-3 ${
                      locale === lang.code ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    } transition-colors font-medium`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="px-6 py-4 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
            >
              {t('contact')}
            </a>
          </div>
        </div>
      )}
    </nav>
  </header>
);
}