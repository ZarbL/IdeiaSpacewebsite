// Models - Estrutura de dados do projeto

export interface HeroContent {
  title: string;
  subtitle: string;
  videoSrc: string;
  buttonText: string;
  buttonLink: string;
}

export interface ChallengeContent {
  title: string;
  videoSrc: string;
  buttonText: string;
  buttonLink: string;
}

export interface CTAContent {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

export interface TechnologiesContent {
  title: string;
  description: string;
  buttonText: string;
  ideiaForward: {
    title: string;
    description: string;
  };
}

export interface PageContent {
  hero: HeroContent;
  challenge: ChallengeContent;
  technologies: TechnologiesContent;
  cta: CTAContent;
}
