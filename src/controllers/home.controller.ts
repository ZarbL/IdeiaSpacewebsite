// Controllers - Lógica de negócio e dados

import { PageContent } from '@/models/content.model';

export class HomeController {
  static getPageContent(t: any): PageContent {
    return {
      hero: {
        title: t('hero.title'),
        subtitle: t('hero.subtitle'),
        videoSrc: '/assets/satellite-orbit.mp4',
        buttonText: t('hero.button'),
        buttonLink: '/about',
      },
      challenge: {
        title: t('challenge.title'),
        videoSrc: '/assets/desafioespacial.mp4',
        buttonText: t('challenge.button'),
        buttonLink: '/services',
      },
      cta: {
        title: t('cta.title'),
        subtitle: t('cta.subtitle'),
        buttonText: t('cta.button'),
        buttonLink: '/contact',
      },
    };
  }
}
