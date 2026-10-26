'use client';

import { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';


// /assets/ é servido com cache "immutable" de 1 ano: o hash do conteúdo no nome
// garante que um modelo novo chegue a quem já visitou o site.
const MODEL_URL = '/assets/models/edusat.c91afb80.glb';

// O .glb não usa compressão Draco nem Meshopt. Ligados (padrão do drei), os
// decoders compilam WebAssembly na carga — exigiria 'wasm-unsafe-eval' na CSP —
// e o Draco busca o decoder em gstatic.com. Religar se o modelo for recomprimido.
const USE_DRACO = false;
const USE_MESHOPT = false;

// Tamanho (unidades da cena) da maior dimensão do corpo do satélite —
// ajuste se ele aparecer grande/pequeno demais na Hero.
const BODY_SIZE = 1.99;

// Fração do comprimento real da fita da antena (0 = esconde). A real tem ~5x o
// corpo e, girando, varreria a tela inteira; 45% ainda lê como antena aberta.
const ANTENNA_LENGTH = 0.45;

function EduSatMesh() {
  const { scene } = useGLTF(MODEL_URL, USE_DRACO, USE_MESHOPT);

  const model = useMemo(() => {
    const model = scene.clone(true);
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh) return;
      // O .glb não traz normais (o loader cairia em flat shading): calcula com
      // vinco de 30° — suave nas peças curvas, quina viva nas placas e caixas.
      mesh.geometry = toCreasedNormals(mesh.geometry, Math.PI / 6);
      const material = mesh.material as THREE.MeshStandardMaterial;
      material.flatShading = false;
      material.needsUpdate = true;
    });

    const antenna = model.getObjectByName('Antenna');
    if (antenna) {
      antenna.visible = ANTENNA_LENGTH > 0;
      // multiplica: a escala do nó já carrega a desquantização das posições
      antenna.scale.z *= ANTENNA_LENGTH || 1;
    }
    return model;
  }, [scene]);

  return <primitive object={model} scale={BODY_SIZE} />;
}

useGLTF.preload(MODEL_URL, USE_DRACO, USE_MESHOPT);

// Arrastar gira o satélite como o globo do Cesium: na horizontal ele gira em
// torno do próprio eixo vertical; na vertical o topo inclina para a câmera
// (limitado a ±90°, dá para ver o topo e a base). Ao soltar, segue no embalo
// com atrito; parado por um tempo, volta ao giro automático.
const DRAG_SENSITIVITY = 1.7 * Math.PI; // radianos por altura de tela arrastada
const INERTIA_DAMPING = 3; // maior = o embalo acaba mais rápido
const AUTO_SPIN_SPEED = 0.35; // rad/s
const AUTO_SPIN_SPEED_REDUCED = 0.05;
const RESUME_AUTO_SPIN_AFTER = 2.5; // s depois de soltar
const MAX_PITCH = Math.PI / 2;

export default function CubeSat({ reducedMotion = false }: { reducedMotion?: boolean }) {
  const spin = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const angles = useRef({ yaw: 0, pitch: 0 });
  const drag = useRef({
    pointerId: null as number | null,
    yawOnly: false,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    moveInterval: 16, // ms médio entre pointermoves (cai junto com o fps)
    velYaw: 0, // rad/s, para o embalo ao soltar
    velPitch: 0,
    idle: Infinity, // s desde a última interação (Infinity = giro automático)
  });

  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      d.pointerId = e.pointerId;
      // No toque o arraste vertical rola a página (touch-action: pan-y no Canvas).
      d.yawOnly = e.pointerType !== 'mouse';
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.lastTime = e.timeStamp;
      d.moveInterval = 16;
      d.velYaw = d.velPitch = 0;
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== d.pointerId) return;
      const k = DRAG_SENSITIVITY / el.clientHeight;
      const dYaw = (e.clientX - d.lastX) * k;
      const dPitch = d.yawOnly ? 0 : (e.clientY - d.lastY) * k;
      const a = angles.current;
      a.yaw += dYaw;
      a.pitch = THREE.MathUtils.clamp(a.pitch + dPitch, -MAX_PITCH, MAX_PITCH);

      const gap = e.timeStamp - d.lastTime;
      d.moveInterval = THREE.MathUtils.lerp(d.moveInterval, gap, 0.3);
      const dt = Math.max(gap / 1000, 1 / 240);
      d.velYaw = THREE.MathUtils.lerp(d.velYaw, dYaw / dt, 0.5);
      d.velPitch = THREE.MathUtils.lerp(d.velPitch, dPitch / dt, 0.5);
      d.lastX = e.clientX;
      d.lastY = e.clientY;
      d.lastTime = e.timeStamp;
      d.idle = 0;
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerId !== d.pointerId) return;
      // Parou antes de soltar, ou o navegador assumiu a rolagem: sem embalo.
      // O limite acompanha o ritmo dos eventos (aparelho lento = eventos espaçados).
      const stoppedFor = e.timeStamp - d.lastTime;
      if (e.type === 'pointercancel' || stoppedFor > Math.max(80, 2.5 * d.moveInterval)) {
        d.velYaw = d.velPitch = 0;
      }
      d.pointerId = null;
      d.idle = 0;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    if (!spin.current) return;
    const a = angles.current;
    const d = drag.current;

    if (d.pointerId === null) {
      const friction = Math.exp(-INERTIA_DAMPING * delta);
      a.yaw += d.velYaw * delta;
      a.pitch += d.velPitch * delta;
      d.velYaw *= friction;
      d.velPitch *= friction;
      if (Math.abs(a.pitch) > MAX_PITCH) {
        a.pitch = Math.sign(a.pitch) * MAX_PITCH;
        d.velPitch = 0;
      }

      // Retomada gradual (1,5 s) do giro automático, voltando a inclinação ao normal.
      d.idle += delta;
      const resume = THREE.MathUtils.clamp((d.idle - RESUME_AUTO_SPIN_AFTER) / 1.5, 0, 1);
      if (resume > 0) {
        a.yaw += (reducedMotion ? AUTO_SPIN_SPEED_REDUCED : AUTO_SPIN_SPEED) * resume * delta;
        a.pitch = THREE.MathUtils.damp(a.pitch, 0, 1.2 * resume, delta);
      }
    }

    // ordem XYZ: gira no eixo vertical do satélite e depois inclina para a câmera
    spin.current.rotation.set(a.pitch, a.yaw, 0);
  });

  return (
    <group ref={spin} scale={0.95}>
      {/* Suspense local: enquanto o .glb carrega, o fundo preto do
          SatelliteBackground continua visível por trás (poster/fallback). */}
      <Suspense fallback={null}>
        <EduSatMesh />
      </Suspense>
    </group>
  );
}
