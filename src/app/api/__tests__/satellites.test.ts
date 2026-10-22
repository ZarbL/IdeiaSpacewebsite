import { describe, it, expect, vi, beforeEach } from 'vitest';

async function loadRoute(env: Record<string, string> = {}) {
  vi.resetModules();
  vi.unstubAllEnvs();
  vi.stubEnv('N2YO_API_KEY', env.N2YO_API_KEY ?? '');
  vi.stubEnv('SPACETRACK_USERNAME', env.SPACETRACK_USERNAME ?? '');
  vi.stubEnv('SPACETRACK_PASSWORD', env.SPACETRACK_PASSWORD ?? '');
  return import('../satellites/route');
}

const get = (groups: string) =>
  new Request(`http://localhost/api/satellites?groups=${groups}`);

const validTleJson = (id: number) => ({
  info: { satname: `SAT-${id}` },
  tle: `1 ${id}U 98067A   24020.5 .0001 00000+0 22948-3 0 9997\r\n2 ${id} 51.6 339.8 0001086 61.8 64.2 15.49861416435025`,
});

beforeEach(() => {
  vi.restoreAllMocks();
  // a rota loga erros esperados (fallback) — silencia o ruído no CI
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('GET /api/satellites — sem credenciais', () => {
  it('N2YO ausente → devolve fallback com header FALLBACK', async () => {
    const { GET } = await loadRoute();
    const res = await GET(get('stations'));
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Cache-Status')).toBe('FALLBACK');
    const body = await res.text();
    expect(body).toContain('ISS (ZARYA)');
  });

  it('grupo ideiaspace sem Space-Track → fallback', async () => {
    const { GET } = await loadRoute();
    const res = await GET(get('ideiaspace'));
    expect(res.headers.get('X-Cache-Status')).toBe('FALLBACK');
    expect(await res.text()).toContain('SARI-1');
  });

  it('grupo desconhecido cai em stations', async () => {
    const { GET } = await loadRoute();
    const res = await GET(get('foobar'));
    expect(await res.text()).toContain('ISS (ZARYA)');
  });
});

describe('GET /api/satellites — com N2YO', () => {
  it('monta o TLE a partir das respostas da N2YO (X-Cache-Status: MISS)', async () => {
    const { GET } = await loadRoute({ N2YO_API_KEY: 'k' });
    vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
      const id = Number(String(url).match(/tle\/(\d+)/)?.[1]);
      return new Response(JSON.stringify(validTleJson(id)), { status: 200 });
    });

    const res = await GET(get('stations'));
    expect(res.headers.get('X-Cache-Status')).toBe('MISS');
    const body = await res.text();
    expect(body).toContain('SAT-25544');
    expect(body.split('\n').filter((l) => l.startsWith('1 ')).length).toBe(3);
  });

  it('resposta HTML da API → TLE inválido → fallback', async () => {
    const { GET } = await loadRoute({ N2YO_API_KEY: 'k' });
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('<!DOCTYPE html><html>bloqueado</html>', { status: 200 })
    );
    const res = await GET(get('stations'));
    expect(res.headers.get('X-Cache-Status')).toBe('FALLBACK');
  });

  it('fetch sempre falhando → fallback com X-Data-Source: fallback-error', async () => {
    const { GET } = await loadRoute({ N2YO_API_KEY: 'k' });
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));
    const res = await GET(get('stations'));
    expect(res.status).toBe(200);
    expect(res.headers.get('X-Data-Source')).toBe('fallback-error');
  });

  it('segunda chamada usa cache (X-Cache-Status: HIT)', async () => {
    const { GET } = await loadRoute({ N2YO_API_KEY: 'k' });
    vi.spyOn(global, 'fetch').mockImplementation(async (url) => {
      const id = Number(String(url).match(/tle\/(\d+)/)?.[1]);
      return new Response(JSON.stringify(validTleJson(id)), { status: 200 });
    });
    await GET(get('stations'));
    const res = await GET(get('stations'));
    expect(res.headers.get('X-Cache-Status')).toBe('HIT');
  });
});
