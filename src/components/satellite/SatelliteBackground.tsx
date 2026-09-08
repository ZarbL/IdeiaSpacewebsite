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
 * Fundo 3D da Hero: um CubeSat animado do Ideia Space sobre um gradiente estelar.
 * - Carrega o three.js só no cliente (dynamic + ssr:false).
 * - O gradiente CSS abaixo funciona como poster/estado de carregamento e como
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
      {/* Gradiente estelar (poster + fallback) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 70% 30%, #1b2a54 0%, #0a1130 45%, #03060f 100%)',
        }}
      />

      {webglOk && (
        <SatelliteScene active={active} reducedMotion={reducedMotion} view={view} />
      )}

      {webglOk && <ViewControls active={view} onChange={setView} />}
    </div>
  );
}
