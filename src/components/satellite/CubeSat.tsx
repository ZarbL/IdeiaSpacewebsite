'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { SatelliteView } from './ViewControls';

/**
 * Malha real do Solar Cube (CubeSat com painéis solares) do Ideia Space.
 * Origem: modelo gerado no Meshy AI em .obj/.mtl/.png
 * (Meshy_AI_Solar_Cube_Circuit_20261021, 22MB, ~237k triângulos), convertido
 * com obj2gltf e otimizado com gltf-transform (weld + simplify 0.1 + resize
 * 1024 + jpeg 85) para ~1,2MB / ~24k triângulos.
 * Os arquivos brutos ficam fora do git — só o .glb otimizado em
 * public/assets/models/solar-cube.glb entra no repositório.
 */

const MODEL_URL = '/assets/models/solar-cube.glb';

// Tamanho alvo (unidades da cena) da maior dimensão do modelo depois de
// normalizado — ajuste se ele aparecer grande/pequeno demais na Hero.
const TARGET_SIZE = 4.6;

function SolarCubeMesh() {
  const { scene } = useGLTF(MODEL_URL);

  // O .glb não carrega uma unidade confiável (veio de um .obj gerado por IA),
  // então centralizamos e normalizamos a escala pelo bounding box real, sem
  // depender do nome dos nós/materiais exportados pelo Meshy.
  const { model, scale, offset } = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 1e-4);
    return { model, scale, offset: center.multiplyScalar(-scale) };
  }, [scene]);

  return <primitive object={model} position={[offset.x, offset.y, offset.z]} scale={scale} />;
}

useGLTF.preload(MODEL_URL);

// Rotação (radianos) que leva a face escolhida a apontar para a câmera,
// partindo da orientação "de fábrica" do modelo (X = eixo das antenas,
// Y = topo/base, Z = frente/trás — a mesma orientação em que o .glb foi
// exportado do Blender). `null` = sem alvo fixo, usa o giro automático.
const VIEW_ROTATIONS: Record<SatelliteView, { x: number; y: number; z: number } | null> = {
  default: null,
  top: { x: Math.PI / 2, y: 0, z: 0 },
  bottom: { x: -Math.PI / 2, y: 0, z: 0 },
  left: { x: 0, y: Math.PI / 2, z: 0 },
  right: { x: 0, y: -Math.PI / 2, z: 0 },
};

export default function CubeSat({
  reducedMotion = false,
  view = 'default',
}: {
  reducedMotion?: boolean;
  view?: SatelliteView;
}) {
  const spin = useRef<THREE.Group>(null);

  useEffect(() => {
    // Normaliza a rotação Y acumulada pelo giro automático (pode passar de
    // muitas voltas) sempre que uma view é escolhida, pra não ter uma
    // interpolação gigante (várias voltas extras) até o ângulo alvo.
    if (spin.current) {
      spin.current.rotation.y %= Math.PI * 2;
    }
  }, [view]);

  useFrame((state, delta) => {
    if (!spin.current) return;
    const target = VIEW_ROTATIONS[view];

    if (!target) {
      // Sem view selecionada: giro automático + leve inclinação seguindo o cursor.
      const speed = reducedMotion ? 0.05 : 0.35;
      spin.current.rotation.y += delta * speed;
      const t = state.clock.elapsedTime;
      spin.current.rotation.x = THREE.MathUtils.lerp(
        spin.current.rotation.x,
        state.pointer.y * 0.25 + Math.sin(t * 0.6) * 0.05,
        0.05,
      );
      spin.current.rotation.z = THREE.MathUtils.lerp(
        spin.current.rotation.z,
        state.pointer.x * -0.15,
        0.05,
      );
      return;
    }

    // View selecionada pelo D-pad: gira suavemente até o ângulo alvo e para ali.
    const ease = 1 - Math.pow(0.001, delta);
    spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, target.x, ease);
    spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, target.y, ease);
    spin.current.rotation.z = THREE.MathUtils.lerp(spin.current.rotation.z, target.z, ease);
  });

  return (
    <group ref={spin} scale={0.95}>
      {/* Suspense local: enquanto o .glb carrega, o fundo preto do
          SatelliteBackground continua visível por trás (poster/fallback). */}
      <Suspense fallback={null}>
        <SolarCubeMesh />
      </Suspense>
    </group>
  );
}
