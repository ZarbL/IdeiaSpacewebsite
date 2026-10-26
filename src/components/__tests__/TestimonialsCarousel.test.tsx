import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TestimonialsCarousel from '../TestimonialsCarousel';

const testimonials = ['Ana', 'Bruno', 'Carla', 'Davi'].map((name) => ({
  name,
  message: `Depoimento de ${name}`,
  image: '/assets/student4.png',
  rating: 5,
}));

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function setup() {
  const { container } = render(<TestimonialsCarousel testimonials={testimonials} />);
  const active = () => container.querySelector('.slide.active')!.textContent;
  return { container, active };
}

describe('TestimonialsCarousel', () => {
  it('começa no primeiro depoimento, com vizinhos prev/next marcados', () => {
    const { container, active } = setup();
    expect(active()).toContain('Ana');
    expect(container.querySelector('.slide.next')!.textContent).toContain('Bruno');
    expect(container.querySelector('.slide.prev')!.textContent).toContain('Davi');
  });

  it('setas têm nome acessível e navegam com volta nas pontas', () => {
    const { active } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }));
    expect(active()).toContain('Davi');
    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }));
    expect(active()).toContain('Bruno');
  });

  it('pontos levam ao slide e marcam o ativo', () => {
    const { active } = setup();
    const dot = screen.getByRole('button', { name: 'Go to slide 3' });
    fireEvent.click(dot);
    expect(active()).toContain('Carla');
    expect(dot).toHaveClass('active');
  });

  it('autoplay a cada 5s, pausado enquanto o mouse está em cima', () => {
    const { container, active } = setup();
    act(() => vi.advanceTimersByTime(5000));
    expect(active()).toContain('Bruno');

    fireEvent.mouseEnter(container.querySelector('.testimonials-carousel')!);
    act(() => vi.advanceTimersByTime(15000));
    expect(active()).toContain('Bruno');

    fireEvent.mouseLeave(container.querySelector('.testimonials-carousel')!);
    act(() => vi.advanceTimersByTime(5000));
    expect(active()).toContain('Carla');
  });
});
