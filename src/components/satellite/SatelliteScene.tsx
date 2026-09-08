'use client';

import { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Float, Stars, Environment, Lightformer } from '@react-three/drei';
import CubeSat from './CubeSat';
import type { SatelliteView } from './ViewControls';

/**
 * Ajusta a distância da câmera conforme o formato da viewport para o
 * satélite caber inteiro tanto em telas largas quanto em celulares.
 */
function CameraRig() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const aspect = size.width / size.height;
    const dist = aspect < 0.8 ? 13 : aspect < 1.2 ? 10 : aspect < 1.7 ? 8 : 7;
    camera.position.set(0, 0.4, dist);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size, invalidate]);

  return null;
}

interface SatelliteSceneProps {
  /** Pausa o render loop quando a Hero sai da tela (economia de bateria/GPU). */
  active?: boolean;
  reducedMotion?: boolean;
  /** Face do satélite selecionada pelo usuário no D-pad (ViewControls). */
  view?: SatelliteView;
}

export default function SatelliteScene({
  active = true,
  reducedMotion = false,
  view = 'default',
}: SatelliteSceneProps) {
  return (
    <Canvas
      style={{ position: 'absolute', inset: 0 }}
      dpr={[1, 1.75]}
      frameloop={active ? 'always' : 'never'}
      camera={{ position: [0, 0.4, 8], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <CameraRig />
      <ambientLight intensity={0.6} />
      <hemisphereLight args={['#cdd7ff', '#0a0a1a', 0.5]} />
      <directionalLight position={[5, 4, 5]} intensity={3.2} color="#ffffff" />
      <pointLight position={[-6, -2, -4]} intensity={55} color="#e6007e" />
      <pointLight position={[4, 2, 6]} intensity={16} color="#5478e6" />

      {/* Com uma face selecionada no D-pad, reduz o flutuar ambiente pra manter a
          view legível — sem competir com a rotação que o usuário pediu. */}
      <Float
        speed={reducedMotion || view !== 'default' ? 0 : 1.4}
        rotationIntensity={reducedMotion || view !== 'default' ? 0 : 0.3}
        floatIntensity={reducedMotion || view !== 'default' ? 0 : 0.6}
      >
        <CubeSat reducedMotion={reducedMotion} view={view} />
      </Float>

      <Stars
        radius={120}
        depth={60}
        count={reducedMotion ? 1200 : 3500}
        factor={4}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.6}
      />

      {/* Ambiente gerado localmente (sem download de HDR) para reflexos no metal */}
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2} position={[0, 3, 2]} scale={[6, 6, 1]} color="#ffffff" />
        <Lightformer intensity={1.4} position={[-4, 0, -3]} scale={[4, 4, 1]} color="#e6007e" />
        <Lightformer intensity={0.9} position={[4, -1, 3]} scale={[3, 3, 1]} color="#3b5bdb" />
      </Environment>
    </Canvas>
  );
}
