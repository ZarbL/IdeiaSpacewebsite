import { test, expect, type Page } from '@playwright/test';
import en from '../messages/en.json';
import es from '../messages/es.json';
import pt from '../messages/pt.json';

const messages = { pt, en, es };

/**
 * Registra violações de CSP — inclusive as da política Report-Only, que não
 * bloqueiam nada mas disparam o evento. Garante que a CSP cobre tudo o que as
 * páginas carregam antes de ela ser promovida a enforcing.
 */
async function collectCspViolations(page: Page) {
  const violations: string[] = [];
  await page.exposeFunction('reportCspViolation', (v: string) => violations.push(v));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (e) => {
      const report = (window as unknown as { reportCspViolation: (v: string) => void }).reportCspViolation;
      report(`${e.effectiveDirective} ← ${e.blockedURI || 'inline'}`);
    });
  });
  return violations;
}

test.describe('home em cada locale', () => {
  for (const [locale, m] of Object.entries(messages)) {
    test(`/${locale} carrega no idioma certo`, async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('heading', { name: m.hero.title })).toBeVisible();
      await expect(page.getByRole('link', { name: m.nav.about }).first()).toBeVisible();
    });
  }

  test('/ redireciona para um locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(pt|en|es)$/);
  });

  test('Hero renderiza o satélite 3D (canvas WebGL)', async ({ page }) => {
    await page.goto('/pt');
    await expect(page.locator('canvas').first()).toBeAttached({ timeout: 15_000 });
  });
});

test('trocar o idioma pelo Header muda a URL e o conteúdo', async ({ page }) => {
  await page.goto('/pt/about');
  await page.getByRole('button', { name: pt.nav.language }).click();
  await page.getByRole('button', { name: /English/ }).click();

  await expect(page).toHaveURL(/\/en\/about$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('link', { name: en.nav.about }).first()).toBeVisible();
});

test('formulário de contato envia e mostra o retorno', async ({ page }) => {
  // Intercepta a API: o smoke não pode disparar email de verdade num deploy com Resend.
  let payload: Record<string, unknown> | undefined;
  await page.route('**/api/contact', async (route) => {
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { success: true, message: 'Mensagem enviada com sucesso!' } });
  });

  await page.goto('/pt#contact');
  const form = page.locator('#contact form');
  await form.getByPlaceholder(pt.contact.form.name).fill('Ada Lovelace');
  await form.getByPlaceholder(pt.contact.form.email).fill('ada@example.com');
  await form.getByPlaceholder(pt.contact.form.subject).fill('Teste E2E');
  await form.getByPlaceholder(pt.contact.form.message).fill('Olá!');
  await form.getByRole('button', { name: pt.contact.form.send }).click();

  await expect(form.getByText('Mensagem enviada com sucesso!')).toBeVisible();
  expect(payload).toMatchObject({ name: 'Ada Lovelace', website: '' });
  expect(typeof payload?.elapsedMs).toBe('number');
});

test('missões: badge abre a descrição com negrito renderizado, sem markup cru', async ({ page }) => {
  await page.goto('/pt/missions');
  await expect(page.getByRole('heading', { name: pt.missions.hero.title })).toBeVisible();

  await page.locator('.badge-button').first().click();
  const description = page.locator('.mission-description');
  await expect(description.locator('strong.mission-objective').first()).toBeVisible();
  await expect(description).not.toContainText('**');
  await expect(description).not.toContainText('<br');
});

test('headers de segurança: anti-clickjacking aplicado e CSP completa em report-only', async ({ request }) => {
  const res = await request.get('/pt');
  const headers = res.headers();
  expect(headers['content-security-policy']).toBe("frame-ancestors 'self'");
  expect(headers['x-frame-options']).toBe('SAMEORIGIN');
  expect(headers['content-security-policy-report-only']).toContain("default-src 'self'");
});

test.describe('nenhuma violação de CSP', () => {
  for (const path of ['/pt', '/pt/about', '/pt/missions', '/pt/services', '/pt/technologies', '/pt/teacher-resources']) {
    test(path, async ({ page }) => {
      const violations = await collectCspViolations(page);
      await page.goto(path, { waitUntil: 'load' });
      // Vídeos em loop não deixam a rede ociosa (networkidle nunca chega): dá uma
      // janela fixa para o JS lazy (three.js, carrosséis) carregar e reportar.
      await page.waitForTimeout(3000);
      expect(violations).toEqual([]);
    });
  }
});
