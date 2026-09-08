'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import type { SatelliteView } from './ViewControls';

/**
 * Malha real do CubeSat do Ideia Space.
 * Origem: modelo gerado (Meshy AI) em .obj/.mtl (~239MB, 2,5M triângulos),
 * reempacotado com gltf-transform (weld + simplify + resize + jpeg) para
 * ~1,3MB / ~25k triângulos e convertido para .glb com gltfjsx.
 * O .obj/.mtl originais ficam fora do git (ver .gitignore) — só o .glb
 * otimizado em public/assets/models/cubesat.glb entra no repositório.
 */

const MODEL_URL = '/assets/models/cubesat.glb';

// Largura alvo (unidades da cena) para a maior dimensão do satélite depois
// de normalizado — ajuste este número se ele aparecer grande/pequeno demais
// na Hero.
const TARGET_WIDTH = 4.6;

type GLTFResult = GLTF & {
  nodes: {
    Meshy_AI_Tiny_Satellite_on_the_0901201309_texture: THREE.Mesh;
  };
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial;
  };
};

function RealSatelliteMesh() {
  const { nodes, materials } = useGLTF(MODEL_URL) as unknown as GLTFResult;
  const geometry = nodes.Meshy_AI_Tiny_Satellite_on_the_0901201309_texture.geometry;

  // O .glb não carrega uma unidade confiável (veio de um .obj gerado por IA),
  // então centralizamos e normalizamos a escala pelo bounding box real,
  // em vez de confiar em valores fixos.
  const { scale, offset } = useMemo(() => {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox as THREE.Box3;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    const scale = TARGET_WIDTH / Math.max(size.x, 1e-4);
    return { scale, offset: center.multiplyScalar(-scale) };
  }, [geometry]);

  return (
    <mesh
      geometry={geometry}
      material={materials['Material.001']}
      position={[offset.x, offset.y, offset.z]}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
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
      {/* Suspense local: enquanto o .glb carrega, o gradiente estelar do
          SatelliteBackground continua visível por trás (poster/fallback). */}
      <Suspense fallback={null}>
        <RealSatelliteMesh />
      </Suspense>
    </group>
  );
}
