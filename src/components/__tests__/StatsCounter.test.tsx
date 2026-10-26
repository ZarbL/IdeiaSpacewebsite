import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsCounter, { parseStat } from '../StatsCounter';

describe('parseStat', () => {
  it.each([
    ['6', { prefix: '', target: 6, suffix: '' }],
    ['1600+', { prefix: '', target: 1600, suffix: '+' }],
    ['1.500+', { prefix: '', target: 1500, suffix: '+' }],
    ['50k', { prefix: '', target: 50, suffix: 'k' }],
    ['+30', { prefix: '+', target: 30, suffix: '' }],
  ])('%s', (input, expected) => {
    expect(parseStat(input)).toEqual(expected);
  });

  it('sem dígitos devolve null', () => {
    expect(parseStat('Um ano')).toBeNull();
  });
});

describe('StatsCounter', () => {
  it('começa em 0 mantendo prefixo/sufixo, e texto sem número aparece como está', () => {
    render(
      <StatsCounter
        title="Título"
        subtitle="Sub"
        stats={[
          { number: '50k', label: 'A' },
          { number: '1600+', label: 'B' },
          { number: 'Um ano', label: 'C' },
        ]}
      />,
    );
    // jsdom nunca dispara o IntersectionObserver: a contagem fica no valor inicial.
    expect(screen.getByText('0k')).toBeInTheDocument();
    expect(screen.getByText('0+')).toBeInTheDocument();
    expect(screen.getByText('Um ano')).toBeInTheDocument();
  });
});
