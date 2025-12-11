// Controllers - Lógica de negócio e dados

import { PageContent } from '@/models/content.model';
import { getVideoUrl } from '@/lib/cloudinary';

export class HomeController {
  static getPageContent(t: any): PageContent {
    return {
      hero: {
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        videoSrc: getVideoUrl('ideiaforword.mp4'),
        buttonText: t('hero.button'),
        buttonLink: '/about',
        aboutButton: t('hero.aboutButton'),
      },
      challenge: {
        title: t('challenge.title'),
        description: t('challenge.description'),
        videoSrc: getVideoUrl('desafioespacial.mp4'),
        buttonText: t('challenge.button'),
        buttonLink: '/services',
      },
      technologies: {
        title: t('technologies.title'),
        description: t('technologies.description'),
        buttonText: t('technologies.button'),
        ideiaForward: {
          title: t('technologies.ideiaForward.title'),
          description: t('technologies.ideiaForward.description'),
        },
      },
      cta: {
        title: t('cta.title'),
        subtitle: t('cta.subtitle'),
        buttonText: t('cta.button'),
        buttonLink: '/services#methodology',
      },
    };
  }
}
