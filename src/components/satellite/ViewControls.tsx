'use client';

import { useTranslations } from 'next-intl';

export type SatelliteView = 'default' | 'top' | 'bottom' | 'left' | 'right';

interface ViewControlsProps {
  active: SatelliteView;
  onChange: (view: SatelliteView) => void;
}

const ARROW_PATHS: Record<'up' | 'down' | 'left' | 'right', string> = {
  up: 'M4.5 15.75l7.5-7.5 7.5 7.5',
  down: 'M19.5 8.25l-7.5 7.5-7.5-7.5',
  left: 'M15.75 19.5L8.25 12l7.5-7.5',
  right: 'M8.25 4.5l7.5 7.5-7.5 7.5',
};

interface ArrowButtonProps {
  direction: keyof typeof ARROW_PATHS;
  view: SatelliteView;
  active: SatelliteView;
  onChange: (view: SatelliteView) => void;
  label: string;
  className?: string;
}

function ArrowButton({ direction, view, active, onChange, label, className = '' }: ArrowButtonProps) {
  const isActive = active === view;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      // clicar de novo na seta ativa volta pro giro automático padrão
      onClick={() => onChange(isActive ? 'default' : view)}
      className={`pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-colors duration-200 ${
        isActive
          ? 'border-white bg-white/30 text-white'
          : 'border-white/30 bg-black/30 text-white/80 hover:bg-white/15 hover:text-white'
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d={ARROW_PATHS[direction]} />
      </svg>
    </button>
  );
}

/**
 * D-pad sobreposto à cena 3D da Hero: cada seta gira o CubeSat até mostrar
 * a face correspondente (cima/baixo/esquerda/direita) para a câmera.
 * Clicar na seta já ativa volta para a rotação automática (view "default").
 */
export default function ViewControls({ active, onChange }: ViewControlsProps) {
  const t = useTranslations('hero');

  return (
    <div className="pointer-events-none absolute bottom-6 right-4 z-20 sm:right-6 md:right-10">
      <div className="relative h-28 w-28">
        <ArrowButton
          direction="up"
          view="top"
          active={active}
          onChange={onChange}
          label={t('viewTop')}
          className="absolute left-1/2 top-0 -translate-x-1/2"
        />
        <ArrowButton
          direction="left"
          view="left"
          active={active}
          onChange={onChange}
          label={t('viewLeft')}
          className="absolute left-0 top-1/2 -translate-y-1/2"
        />
        <ArrowButton
          direction="right"
          view="right"
          active={active}
          onChange={onChange}
          label={t('viewRight')}
          className="absolute right-0 top-1/2 -translate-y-1/2"
        />
        <ArrowButton
          direction="down"
          view="bottom"
          active={active}
          onChange={onChange}
          label={t('viewBottom')}
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
        />
      </div>
    </div>
  );
}
