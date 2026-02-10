"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DiagramCanvas } from "./DiagramCanvas";
import { Annotation } from "./Annotation";

function ParticleStream({
  yOffset,
  direction,
  color,
}: {
  yOffset: number;
  direction: number;
  color: string;
}) {
  const ref = useRef<THREE.Points>(null);
  const count = 60;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (i / count) * 4 - 2;
      arr[i * 3 + 1] = yOffset + (Math.random() - 0.5) * 0.04;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
    }
    return arr;
  }, [yOffset]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += delta * 2.0 * direction;
      if (direction > 0 && arr[i * 3] > 2) arr[i * 3] = -2;
      if (direction < 0 && arr[i * 3] < -2) arr[i * 3] = 2;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.05}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function TubeCrossSection() {
  return (
    <group>
      {/* Outer tube wall — cutaway (half cylinder) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 32, 1, true, 0, Math.PI]} />
        <meshStandardMaterial
          color="#7799bb"
          metalness={0.4}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner vacuum wall */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 4.02, 32, 1, true, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#5577aa"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom half — solid wall showing cross-section */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.5, 0.5, 4, 32, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial
          color="#667799"
          metalness={0.4}
          roughness={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.35, 0.35, 4.02, 32, 1, true, Math.PI, Math.PI]} />
        <meshStandardMaterial
          color="#5577aa"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Magnetic bearing coils visible in the wall */}
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.42, 0.025, 8, 24]} />
          <meshStandardMaterial
            color="#ee6644"
            emissive="#cc4422"
            emissiveIntensity={0.6}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Cross-section end caps for visual clarity */}
      {[-2, 2].map((x, i) => (
        <mesh key={`cap-${i}`} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <ringGeometry args={[0.35, 0.5, 32]} />
          <meshStandardMaterial
            color="#8899aa"
            metalness={0.4}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function ThreadingScene() {
  return (
    <>
      <TubeCrossSection />

      {/* Two counter-rotating particle streams */}
      <ParticleStream yOffset={0.08} direction={1} color="#ff6644" />
      <ParticleStream yOffset={-0.08} direction={-1} color="#44aaff" />

      <Annotation
        anchor={[0, 0.08, 0]}
        label="Rotor Mass Stream"
        offset={[0.6, 0.8, 0.3]}
      />
      <Annotation
        anchor={[0, -0.08, 0]}
        label="Counter-Rotating Stream"
        offset={[-0.8, -0.6, 0.5]}
      />
      <Annotation
        anchor={[0.4, 0.42, 0]}
        label="Magnetic Bearing Coils"
        offset={[0.5, 0.5, 0.5]}
      />
      <Annotation
        anchor={[0, 0.35, 0]}
        label="Vacuum Wall"
        offset={[-0.7, 0.4, 0.6]}
      />
    </>
  );
}

export function ThreadingDiagram() {
  return (
    <DiagramCanvas cameraPosition={[3, 2.5, 4]}>
      <ThreadingScene />
    </DiagramCanvas>
  );
}
