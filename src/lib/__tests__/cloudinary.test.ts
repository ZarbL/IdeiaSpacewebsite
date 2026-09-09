import { describe, it, expect, beforeEach, vi } from 'vitest';

async function load(useCloudinary: boolean) {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_USE_CLOUDINARY', useCloudinary ? 'true' : 'false');
  vi.stubEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'testcloud');
  return import('../cloudinary');
}

beforeEach(() => vi.unstubAllEnvs());

describe('getCloudinaryVideoUrl', () => {
  it('monta a URL com transformações de qualidade e formato', async () => {
    const { getCloudinaryVideoUrl } = await load(true);
    const url = getCloudinaryVideoUrl('ideiaspace/x', { quality: 'auto:good', format: 'webm', width: 640 });
    expect(url).toBe('https://res.cloudinary.com/testcloud/video/upload/q_auto:good,w_640,f_webm/ideiaspace/x');
  });

  it('usa defaults auto:eco / f_auto', async () => {
    const { getCloudinaryVideoUrl } = await load(true);
    expect(getCloudinaryVideoUrl('a/b')).toBe(
      'https://res.cloudinary.com/testcloud/video/upload/q_auto:eco,f_auto/a/b'
    );
  });
});

describe('getCloudinaryImageUrl', () => {
  it('default de qualidade é 80', async () => {
    const { getCloudinaryImageUrl } = await load(true);
    expect(getCloudinaryImageUrl('a/b')).toBe(
      'https://res.cloudinary.com/testcloud/image/upload/q_80,f_auto/a/b'
    );
  });
});

describe('getVideoUrl / getImageUrl — toggle Cloudinary', () => {
  it('com USE_CLOUDINARY=false devolve caminho local', async () => {
    const { getVideoUrl, getImageUrl } = await load(false);
    expect(getVideoUrl('ideiaforword.mp4')).toBe('/assets/ideiaforword.mp4');
    expect(getImageUrl('card1.png')).toBe('/assets/card1.png');
  });

  it('com USE_CLOUDINARY=true mapeia arquivos conhecidos para o Cloudinary', async () => {
    const { getVideoUrl, getImageUrl } = await load(true);
    expect(getVideoUrl('ideiaforword.mp4')).toContain('res.cloudinary.com/testcloud/video/upload');
    expect(getImageUrl('card1.png')).toContain('res.cloudinary.com/testcloud/image/upload');
  });

  it('arquivo desconhecido cai para o caminho local mesmo com Cloudinary ligado', async () => {
    const { getVideoUrl, getImageUrl } = await load(true);
    expect(getVideoUrl('inexistente.mp4')).toBe('/assets/inexistente.mp4');
    expect(getImageUrl('inexistente.png')).toBe('/assets/inexistente.png');
  });

  it('vetorizada.png (logo) sempre vem do local', async () => {
    const { getImageUrl } = await load(true);
    expect(getImageUrl('vetorizada.png')).toBe('/assets/vetorizada.png');
  });
});
