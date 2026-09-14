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
  return import('../contact/route');
}

const post = (body: unknown) =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const valid = { name: 'Ada', email: 'ada@example.com', subject: 'Oi', message: 'Olá!' };

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ data: { id: 'email_123' } });
});

describe('POST /api/contact — validação', () => {
  it('400 quando falta um campo', async () => {
    const { POST } = await loadRoute('re_test');
    for (const missing of ['name', 'email', 'subject', 'message']) {
      const body: Record<string, string> = { ...valid };
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
