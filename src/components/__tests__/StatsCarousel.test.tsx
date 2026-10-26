import { screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithIntl } from '@/test/utils';
import StatsCarousel from '../StatsCarousel';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function setup() {
  const { container } = renderWithIntl(<StatsCarousel locale="pt" />);
  const track = container.querySelector<HTMLElement>('[style*="translateX"]')!;
  return { offset: () => track.style.transform };
}

describe('StatsCarousel', () => {
  it('renderiza os três slides traduzidos', () => {
    setup();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Ir para slide/ })).toHaveLength(3);
  });

  it('setas navegam e dão a volta nas pontas', () => {
    const { offset } = setup();
    expect(offset()).toBe('translateX(-0%)');

    fireEvent.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(offset()).toBe('translateX(-100%)');

    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    fireEvent.click(screen.getByRole('button', { name: 'Anterior' }));
    expect(offset()).toBe('translateX(-200%)');

    fireEvent.click(screen.getByRole('button', { name: 'Próximo' }));
    expect(offset()).toBe('translateX(-0%)');
  });

  it('os pontos levam direto ao slide', () => {
    const { offset } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Ir para slide 3' }));
    expect(offset()).toBe('translateX(-200%)');
  });

  it('autoplay avança a cada 4s', () => {
    const { offset } = setup();
    act(() => vi.advanceTimersByTime(4000));
    expect(offset()).toBe('translateX(-100%)');
    act(() => vi.advanceTimersByTime(8000));
    expect(offset()).toBe('translateX(-0%)');
  });
});
