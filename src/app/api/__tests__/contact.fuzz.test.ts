import { describe, it, expect, vi, beforeEach } from 'vitest';
import fc from 'fast-check';

const sendMock = vi.fn().mockResolvedValue({ data: { id: 'x' } });
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.stubEnv('RESEND_API_KEY', '');

const RUNS = Number(process.env.FUZZ_RUNS || 200);

beforeEach(() => sendMock.mockClear());

describe('POST /api/contact — fuzzing do corpo', () => {
  it('nunca lança nem responde 5xx para corpo arbitrário', async () => {
    const { POST } = await import('../contact/route');
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const req = new Request('http://localhost/api/contact', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body) ?? 'null',
        });
        const res = await POST(req as never);
        expect(res.status).toBeLessThan(500);
        expect(res.headers.get('content-type')).toMatch(/json/);
      }),
      { numRuns: RUNS }
    );
  });

  it('campos string arbitrários: 200 ou 400, nunca crash', async () => {
    const { POST } = await import('../contact/route');
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string(),
          email: fc.string(),
          subject: fc.string(),
          message: fc.string(),
        }),
        async (body) => {
          const req = new Request('http://localhost/api/contact', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
          });
          const res = await POST(req as never);
          expect([200, 400]).toContain(res.status);
        }
      ),
      { numRuns: RUNS }
    );
  });
});
