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

export interface PageContent {
  hero: HeroContent;
  challenge: ChallengeContent;
  cta: CTAContent;
}
