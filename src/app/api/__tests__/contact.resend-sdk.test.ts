import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Usa o SDK real do Resend (sem vi.mock) e simula só a rede (fetch).
// O SDK v6 não lança exceção em erro HTTP nem de rede: devolve
// `{ data: null, error }`. Estes testes fixam esse contrato na rota.

async function loadRoute() {
  vi.resetModules();
  vi.stubEnv('RESEND_API_KEY', 're_test_sdk_contract');
  return import('../contact/route');
}

const post = (body: unknown) =>
  new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const valid = { name: 'Ada', email: 'ada@example.com', subject: 'Oi', message: 'Olá!' };

beforeEach(() => {
  vi.restoreAllMocks();
  // a rota loga o resultado do envio — silencia o ruído no CI
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/contact — contrato real do SDK do Resend', () => {
  it('Resend aceita o envio → 200 com o id', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ id: 'email_sdk_ok' }, 200));
    const { POST } = await loadRoute();

    const res = await POST(post(valid) as never);

    expect(String(fetchSpy.mock.calls[0][0])).toMatch(/\/emails$/);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true, emailId: 'email_sdk_ok' });
  });

  it('Resend recusa o envio (HTTP 403) → 500 com fallback mailto', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      jsonResponse({ statusCode: 403, name: 'validation_error', message: 'recusado' }, 403)
    );
    const { POST } = await loadRoute();

    const res = await POST(post(valid) as never);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBeUndefined();
    expect(json.useMailto).toBe(true);
    expect(json.mailtoLink).toMatch(/^mailto:/);
  });

  it('Resend inacessível (falha de rede) → 500 com fallback mailto', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('fetch failed'));
    const { POST } = await loadRoute();

    const res = await POST(post(valid) as never);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBeUndefined();
    expect(json.useMailto).toBe(true);
  });
});
