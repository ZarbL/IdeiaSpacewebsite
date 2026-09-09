import { describe, it, expect, vi } from 'vitest';
import { HomeController } from '../home.controller';

// getVideoUrl é testado à parte; aqui só interessa que o controller monta a
// árvore de conteúdo a partir da função de tradução.
vi.mock('@/lib/cloudinary', () => ({
  getVideoUrl: (f: string) => `/assets/${f}`,
}));

describe('HomeController.getPageContent', () => {
  const t = (key: string) => `T:${key}`;

  it('devolve as quatro seções com o shape esperado', () => {
    const c = HomeController.getPageContent(t);

    expect(Object.keys(c).sort()).toEqual(['challenge', 'cta', 'hero', 'technologies']);
    expect(c.hero).toMatchObject({
      title: 'T:hero.title',
      subtitle: 'T:hero.subtitle',
      buttonLink: '/about',
      videoSrc: '/assets/ideiaforword.mp4',
    });
    expect(c.challenge.videoSrc).toBe('/assets/desafioespacial.mp4');
    expect(c.technologies.ideiaForward).toMatchObject({
      title: 'T:technologies.ideiaForward.title',
      description: 'T:technologies.ideiaForward.description',
    });
    expect(c.cta.buttonLink).toBe('/services#methodology');
  });

  it('toda string de texto passa pela função de tradução', () => {
    const seen: string[] = [];
    HomeController.getPageContent((k: string) => {
      seen.push(k);
      return k;
    });
    expect(seen).toEqual(expect.arrayContaining(['hero.title', 'challenge.description', 'cta.button']));
  });
});
