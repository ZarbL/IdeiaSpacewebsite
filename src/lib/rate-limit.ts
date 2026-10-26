import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/** Formulário de contato: 3 envios a cada 10 minutos por IP (janela deslizante). */
export const CONTACT_LIMIT = { requests: 3, windowMs: 10 * 60 * 1000 } as const;

export interface RateLimitResult {
  success: boolean;
  /** Timestamp (ms) em que a janela volta a aceitar um envio. */
  reset: number;
}

export interface RateLimiter {
  limit(key: string): Promise<RateLimitResult>;
}

/**
 * Janela deslizante em memória. No serverless cada instância tem a sua, então
 * isso só segura rajadas contra a mesma instância — é o fallback para dev/CI
 * ou quando o Upstash não está configurado/disponível.
 */
export function memoryLimiter(requests: number, windowMs: number): RateLimiter {
  const hits = new Map<string, number[]>();

  return {
    async limit(key) {
      const now = Date.now();
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      const success = recent.length < requests;
      if (success) recent.push(now);
      hits.set(key, recent);

      // Não deixa o Map crescer sem limite com IPs que já saíram da janela.
      if (hits.size > 1000) {
        for (const [k, ts] of hits) {
          if (now - ts[ts.length - 1] >= windowMs) hits.delete(k);
        }
      }

      return { success, reset: recent[0] + windowMs };
    },
  };
}

/**
 * Upstash Redis compartilhado entre instâncias. A integração da Vercel
 * Marketplace injeta `KV_REST_API_*`; um setup manual usa `UPSTASH_REDIS_REST_*`.
 */
function upstashLimiter(fallback: RateLimiter): RateLimiter | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(CONTACT_LIMIT.requests, `${CONTACT_LIMIT.windowMs} ms`),
    prefix: 'ratelimit:contact',
    // Redis lento não pode travar o formulário: após 1s o Upstash libera.
    timeout: 1000,
  });

  return {
    async limit(key) {
      try {
        const { success, reset } = await ratelimit.limit(key);
        return { success, reset };
      } catch (error) {
        console.error('Upstash rate limit failed, using in-memory limiter:', error);
        return fallback.limit(key);
      }
    },
  };
}

let contactLimiter: RateLimiter | undefined;

export function getContactLimiter(): RateLimiter {
  if (!contactLimiter) {
    const memory = memoryLimiter(CONTACT_LIMIT.requests, CONTACT_LIMIT.windowMs);
    contactLimiter = upstashLimiter(memory) ?? memory;
  }
  return contactLimiter;
}
