import { describe, it, expect, vi, beforeEach } from 'vitest';

const sendMock = vi.fn();
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

async function loadRoute(apiKey?: string) {
  vi.resetModules();
  vi.unstubAllEnvs();
  if (apiKey) vi.stubEnv('RESEND_API_KEY', apiKey);
  else vi.stubEnv('RESEND_API_KEY', '');
  // Sem Upstash: o rate limit cai no limiter em memória (zerado a cada resetModules).
  vi.stubEnv('UPSTASH_REDIS_REST_URL', '');
  vi.stubEnv('KV_REST_API_URL', '');
  return import('../contact/route');
}

const post = (body: unknown, ip = '203.0.113.7') =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `${ip}, 10.0.0.1` },
    body: JSON.stringify(body),
  });

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  subject: 'Oi',
  message: 'Olá!',
  website: '',
  elapsedMs: 5000,
};

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: 'email_123' } });
});

describe('POST /api/contact — validação', () => {
  it('400 quando falta um campo', async () => {
    const { POST } = await loadRoute('re_test');
    for (const missing of ['name', 'email', 'subject', 'message']) {
      const body: Record<string, unknown> = { ...valid };
      delete body[missing];
      const res = await POST(post(body) as never);
      expect(res.status).toBe(400);
    }
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('400 para email malformado', async () => {
    const { POST } = await loadRoute('re_test');
    const res = await POST(post({ ...valid, email: 'nao-eh-email' }) as never);
    expect(res.status).toBe(400);
  });
});

describe('POST /api/contact — anti-bot', () => {
  it.each([
    ['honeypot preenchido', { ...valid, website: 'http://spam.example' }],
    ['enviado rápido demais', { ...valid, elapsedMs: 800 }],
    ['sem elapsedMs (POST direto na API)', { ...valid, elapsedMs: undefined }],
  ])('%s → 200 de fachada, sem enviar', async (_, body) => {
    const { POST } = await loadRoute('re_test');
    const res = await POST(post(body) as never);
    expect(res.status).toBe(200);
    expect((await res.json()).success).toBe(true);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/contact — rate limit', () => {
  it('a partir do 4º envio do mesmo IP responde 429 com Retry-After', async () => {
    const { POST } = await loadRoute('re_test');
    const statuses: number[] = [];
    let last: Response | undefined;
    for (let i = 0; i < 5; i++) {
      last = await POST(post(valid) as never);
      statuses.push(last.status);
    }
    expect(statuses).toEqual([200, 200, 200, 429, 429]);
    expect(Number(last!.headers.get('retry-after'))).toBeGreaterThan(0);
    expect(sendMock).toHaveBeenCalledTimes(3);
  });

  it('o limite é por IP', async () => {
    const { POST } = await loadRoute('re_test');
    for (let i = 0; i < 3; i++) await POST(post(valid, '198.51.100.1') as never);
    expect((await POST(post(valid, '198.51.100.1') as never)).status).toBe(429);
    expect((await POST(post(valid, '198.51.100.2') as never)).status).toBe(200);
  });

  it('erro de validação não consome a cota', async () => {
    const { POST } = await loadRoute('re_test');
    for (let i = 0; i < 5; i++) await POST(post({ ...valid, email: 'x' }) as never);
    expect((await POST(post(valid) as never)).status).toBe(200);
  });
});

describe('POST /api/contact — sem RESEND_API_KEY (fallback mailto)', () => {
  it('200 com useMailto e link mailto escapado', async () => {
    const { POST } = await loadRoute();
    const res = await POST(post(valid) as never);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.useMailto).toBe(true);
    expect(json.mailtoLink).toMatch(/^mailto:/);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

describe('POST /api/contact — com RESEND_API_KEY', () => {
  it('envia o email e retorna o id', async () => {
    const { POST } = await loadRoute('re_test');
    const res = await POST(post(valid) as never);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.emailId).toBe('email_123');
    expect(sendMock).toHaveBeenCalledOnce();
  });

  it('não injeta HTML do usuário no corpo do email (escapa < > & ")', async () => {
    const { POST } = await loadRoute('re_test');
    await POST(
      post({
        ...valid,
        name: '<script>alert(1)</script>',
        message: 'a & b < c > d "e"',
      }) as never
    );
    const html: string = sendMock.mock.calls[0][0].html;
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('a &amp; b &lt; c &gt; d');
  });

  it('erro do Resend → 500 com fallback mailto', async () => {
    sendMock.mockRejectedValue(new Error('resend down'));
    const { POST } = await loadRoute('re_test');
    const res = await POST(post(valid) as never);
    expect(res.status).toBe(500);
    expect((await res.json()).useMailto).toBe(true);
  });
});
