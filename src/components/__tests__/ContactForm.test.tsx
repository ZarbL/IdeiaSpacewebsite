import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithIntl } from '@/test/utils';
import ContactForm from '../ContactForm';

const fetchMock = vi.fn();

const respond = (status: number, body: unknown) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByPlaceholderText('Nome'), 'Ada');
  await user.type(screen.getByPlaceholderText('Email'), 'ada@example.com');
  await user.type(screen.getByPlaceholderText('Assunto'), 'Oi');
  await user.type(screen.getByPlaceholderText('Mensagem'), 'Olá!');
  await user.click(screen.getByRole('button', { name: 'Enviar Mensagem' }));
}

describe('ContactForm', () => {
  it('envia os campos, o honeypot vazio e o tempo de preenchimento', async () => {
    fetchMock.mockResolvedValue(respond(200, { success: true, message: 'ok' }));
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillAndSubmit(user);

    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({ method: 'POST' }));
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'Oi',
      message: 'Olá!',
      website: '',
    });
    expect(typeof body.elapsedMs).toBe('number');
  });

  it('o honeypot fica fora da navegação e da árvore de acessibilidade', () => {
    const { container } = renderWithIntl(<ContactForm />);
    const honeypot = container.querySelector('input[name="website"]')!;
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('mostra "Enviando..." e desabilita o botão enquanto envia', async () => {
    let resolve!: (v: unknown) => void;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillAndSubmit(user);

    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();
    await act(async () => resolve(respond(200, { success: true, message: 'ok' })));
    expect(screen.getByRole('button', { name: 'Enviar Mensagem' })).toBeEnabled();
  });

  it('sucesso: mostra a mensagem do servidor e limpa o formulário depois de 3s', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    fetchMock.mockResolvedValue(respond(200, { success: true, message: 'Mensagem enviada!' }));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithIntl(<ContactForm />);

    await fillAndSubmit(user);
    expect(await screen.findByText('Mensagem enviada!')).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(3000));
    expect(screen.queryByText('Mensagem enviada!')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome')).toHaveValue('');
  });

  it('fallback mailto: mostra o link (nova aba) em vez de sair da página e mantém os dados', async () => {
    fetchMock.mockResolvedValue(
      respond(200, {
        success: true,
        message: 'Mensagem recebida!',
        useMailto: true,
        mailtoLink: 'mailto:admin@ideiaspace.com?subject=Oi',
      }),
    );
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillAndSubmit(user);

    const link = await screen.findByRole('link', { name: 'Abrir no meu e-mail' });
    expect(link).toHaveAttribute('href', 'mailto:admin@ideiaspace.com?subject=Oi');
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByPlaceholderText('Nome')).toHaveValue('Ada');
  });

  it('429: mostra o erro do servidor, sem link mailto', async () => {
    fetchMock.mockResolvedValue(respond(429, { error: 'Muitas mensagens em pouco tempo.' }));
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillAndSubmit(user);

    expect(await screen.findByText('Muitas mensagens em pouco tempo.')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('falha de rede: mensagem genérica de erro', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await fillAndSubmit(user);

    expect(await screen.findByText('Erro ao enviar mensagem. Tente novamente.')).toBeInTheDocument();
  });

  it('usa as traduções do locale', () => {
    renderWithIntl(<ContactForm />, { locale: 'en' });
    expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });
});
