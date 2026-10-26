import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithIntl } from '@/test/utils';
import Header from '../Header';

const push = vi.fn();
let pathname = '/pt/about';

vi.mock('next/navigation', () => ({
  usePathname: () => pathname,
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  push.mockReset();
  pathname = '/pt/about';
});

describe('Header', () => {
  it('troca o locale mantendo a página atual', () => {
    renderWithIntl(<Header />);
    const toggle = screen.getByRole('button', { name: 'Idioma' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: /English/ }));

    expect(push).toHaveBeenCalledWith('/en/about');
    expect(screen.queryByRole('button', { name: /English/ })).not.toBeInTheDocument();
  });

  it('links usam o locale atual', () => {
    renderWithIntl(<Header />, { locale: 'es' });
    const about = screen.getAllByRole('link', { name: 'Sobre Nosotros' })[0];
    expect(about).toHaveAttribute('href', '/es/about');
  });

  it('menu mobile abre e fecha ao navegar', () => {
    renderWithIntl(<Header />);
    const before = screen.getAllByRole('link', { name: 'Missões' }).length;

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    const links = screen.getAllByRole('link', { name: 'Missões' });
    expect(links).toHaveLength(before + 1);

    // jsdom não navega; o onClick do link (que fecha o menu) roda mesmo assim.
    const preventNavigation = (e: Event) => e.preventDefault();
    document.addEventListener('click', preventNavigation, true);
    fireEvent.click(links[links.length - 1]);
    document.removeEventListener('click', preventNavigation, true);

    expect(screen.getAllByRole('link', { name: 'Missões' })).toHaveLength(before);
  });
});
