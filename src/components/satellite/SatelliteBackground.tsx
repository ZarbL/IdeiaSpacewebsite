'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ViewControls, { SatelliteView } from './ViewControls';

const SatelliteScene = dynamic(() => import('./SatelliteScene'), { ssr: false });

function detectWebgl(): boolean {
  if (typeof document === 'undefined') return true; // otimista no SSR
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function detectReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fundo 3D da Hero: um CubeSat animado do Ideia Space sobre fundo preto.
 * - Carrega o three.js só no cliente (dynamic + ssr:false).
 * - O fundo preto abaixo funciona como poster/estado de carregamento e como
 *   fallback caso o WebGL não esteja disponível.
 * - Pausa o render loop quando a Hero sai da viewport.
 * - Respeita prefers-reduced-motion.
 */
export default function SatelliteBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(detectReducedMotion);
  const [webglOk] = useState(detectWebgl);
  const [view, setView] = useState<SatelliteView>('default');

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener('change', onChange);

    const el = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    if (el) observer.observe(el);

    return () => {
      mq.removeEventListener('change', onChange);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Fundo preto (poster + fallback) */}
      <div className="absolute inset-0 bg-black" />

      {webglOk && (
        <SatelliteScene active={active} reducedMotion={reducedMotion} view={view} />
      )}

      {webglOk && <ViewControls active={view} onChange={setView} />}
    </div>
  );
}
