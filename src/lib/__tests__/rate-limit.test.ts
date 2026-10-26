import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const limitMock = vi.fn();
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
    },
    { slidingWindow: () => ({}) },
  ),
}));
vi.mock('@upstash/redis', () => ({ Redis: class {} }));

async function load(env: Record<string, string> = {}) {
  vi.resetModules();
  vi.unstubAllEnvs();
  for (const k of ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN', 'KV_REST_API_URL', 'KV_REST_API_TOKEN']) {
    vi.stubEnv(k, env[k] ?? '');
  }
  return import('../rate-limit');
}

// Com chaves: um hook que retorna função vira teardown, e o Vitest chamaria o mock.
beforeEach(() => {
  limitMock.mockReset();
});

describe('memoryLimiter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('aceita N por janela e bloqueia o resto, com reset no fim da janela', async () => {
    const { memoryLimiter } = await load();
    const limiter = memoryLimiter(3, 60_000);
    const t0 = Date.now();

    const results = [];
    for (let i = 0; i < 4; i++) results.push(await limiter.limit('ip'));

    expect(results.map((r) => r.success)).toEqual([true, true, true, false]);
    expect(results[3].reset).toBe(t0 + 60_000);
  });

  it('janela deslizante: libera conforme os envios antigos expiram', async () => {
    const { memoryLimiter } = await load();
    const limiter = memoryLimiter(2, 60_000);

    await limiter.limit('ip');
    vi.advanceTimersByTime(30_000);
    await limiter.limit('ip');
    expect((await limiter.limit('ip')).success).toBe(false);

    vi.advanceTimersByTime(30_000); // o primeiro sai da janela
    expect((await limiter.limit('ip')).success).toBe(true);
    expect((await limiter.limit('ip')).success).toBe(false);
  });

  it('chaves são independentes', async () => {
    const { memoryLimiter } = await load();
    const limiter = memoryLimiter(1, 60_000);
    expect((await limiter.limit('a')).success).toBe(true);
    expect((await limiter.limit('a')).success).toBe(false);
    expect((await limiter.limit('b')).success).toBe(true);
  });
});

describe('getContactLimiter', () => {
  it('sem env do Upstash usa memória (não chama o Upstash)', async () => {
    const { getContactLimiter } = await load();
    expect((await getContactLimiter().limit('ip')).success).toBe(true);
    expect(limitMock).not.toHaveBeenCalled();
  });

  it.each([
    ['UPSTASH_REDIS_REST_*', { UPSTASH_REDIS_REST_URL: 'https://x.upstash.io', UPSTASH_REDIS_REST_TOKEN: 't' }],
    ['KV_REST_API_* (integração Vercel)', { KV_REST_API_URL: 'https://x.upstash.io', KV_REST_API_TOKEN: 't' }],
  ])('com %s usa o Upstash', async (_, env) => {
    limitMock.mockResolvedValue({ success: false, reset: 123, limit: 3, remaining: 0 });
    const { getContactLimiter } = await load(env);
    expect(await getContactLimiter().limit('ip')).toEqual({ success: false, reset: 123 });
    expect(limitMock).toHaveBeenCalledWith('ip');
  });

  it('se o Upstash falhar, cai no limiter em memória', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    limitMock.mockRejectedValue(new Error('network'));
    const { getContactLimiter } = await load({
      UPSTASH_REDIS_REST_URL: 'https://x.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: 't',
    });
    const limiter = getContactLimiter();
    const results = [];
    for (let i = 0; i < 4; i++) results.push((await limiter.limit('ip')).success);
    expect(results).toEqual([true, true, true, false]);
  });
});
