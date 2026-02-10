"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;
const RING_R = R + 400;
// Ring tube visible at macro scale: 80 unit radius = 160 km diameter
const TUBE_R = 80;
const PARTICLE_COUNT = 300;

interface AcceleratingMassProps {
  progress: number;
}

export function AcceleratingMass({ progress }: AcceleratingMassProps) {
  const particlesRef = useRef<THREE.Points>(null);

  const speed = 0.1 + progress * 4;

  // Ring outline
  const ringLine = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 256;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * RING_R, 0, Math.sin(angle) * RING_R));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: "#4488ff", transparent: true, opacity: 0.6 });
    return new THREE.Line(geom, mat);
  }, []);

  const particleData = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      angle: (i / PARTICLE_COUNT) * Math.PI * 2,
      radialOffset: (Math.random() - 0.5) * TUBE_R * 0.4,
      verticalOffset: (Math.random() - 0.5) * TUBE_R * 0.4,
    }));
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const colors = useMemo(() => {
    const c = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      c[i * 3] = 1; c[i * 3 + 1] = 0.6; c[i * 3 + 2] = 0.2;
    }
    return c;
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particleData[i];
      p.angle += delta * speed;
      if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

      // Stream fills up over progress
      const visible = progress > (i / PARTICLE_COUNT) * 0.4;
      if (visible) {
        const r = RING_R + p.radialOffset;
        positions[i * 3] = Math.cos(p.angle) * r;
        positions[i * 3 + 1] = p.verticalOffset;
        positions[i * 3 + 2] = Math.sin(p.angle) * r;

        const heat = Math.min(1, progress * 1.5);
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.5 + heat * 0.4;
        colors[i * 3 + 2] = 0.1 + heat * 0.8;
      } else {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = -999999;
        positions[i * 3 + 2] = 0;
      }
    }

    const posAttr = particlesRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    const colAttr = particlesRef.current.geometry.getAttribute("color") as THREE.BufferAttribute;
    if (colAttr) colAttr.needsUpdate = true;

    const mat = ringLine.material as THREE.LineBasicMaterial;
    mat.opacity = 0.3 + progress * 0.7;
  });

  const liftOffset = progress * 20;

  return (
    <group>
      <primitive object={ringLine} />

      {/* Ring tube structure — thick enough to see at macro distances */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_R + liftOffset, TUBE_R, 24, 200]} />
        <meshStandardMaterial
          color="#334466"
          emissive="#2244aa"
          emissiveIntensity={progress * 1.5}
          transparent
          opacity={0.3 + progress * 0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Rotor particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={20 + progress * 30}
          sizeAttenuation
          transparent
          opacity={0.8}
          vertexColors
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Energy glow halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_R + liftOffset, TUBE_R + 40, 8, 128]} />
        <meshStandardMaterial
          color="#4488ff"
          emissive="#4488ff"
          emissiveIntensity={progress * 2.5}
          transparent
          opacity={progress * 0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
