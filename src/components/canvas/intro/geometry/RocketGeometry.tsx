"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RocketGeometryProps {
  scale?: number;
  exhaustIntensity?: number;
  fairingOpen?: number; // 0 = closed, 1 = fully open
}

export function RocketGeometry({
  scale = 1,
  exhaustIntensity = 1,
  fairingOpen = 0,
}: RocketGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Points>(null);

  // Exhaust particle positions
  const particleCount = 30;
  const exhaustPositions = useMemo(
    () => new Float32Array(particleCount * 3),
    [],
  );
  const exhaustData = useMemo(
    () =>
      Array.from({ length: particleCount }, () => ({
        offset: Math.random(),
        radial: Math.random() * 0.02,
        angle: Math.random() * Math.PI * 2,
      })),
    [],
  );

  useFrame((_, delta) => {
    if (!exhaustRef.current) return;
    for (let i = 0; i < particleCount; i++) {
      const p = exhaustData[i];
      p.offset += delta * 3;
      if (p.offset > 1) p.offset -= 1;
      const dist = p.offset * 0.12;
      const spread = p.radial * (1 + p.offset * 2);
      exhaustPositions[i * 3] = Math.cos(p.angle) * spread;
      exhaustPositions[i * 3 + 1] = -0.08 - dist;
      exhaustPositions[i * 3 + 2] = Math.sin(p.angle) * spread;
    }
    (
      exhaustRef.current.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute
    ).needsUpdate = true;
  });

  // Fairing halves angle
  const fairingAngle = fairingOpen * 0.8;

  return (
    <group ref={groupRef} scale={scale}>
      {/* First stage body */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.02, 0.022, 0.08, 16]} />
        <meshStandardMaterial
          color="#dddddd"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Second stage */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.016, 0.02, 0.04, 16]} />
        <meshStandardMaterial
          color="#cccccc"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>

      {/* Fairing halves */}
      <group position={[0, 0.07, 0]}>
        {/* Left half */}
        <group rotation={[fairingAngle, 0, 0]}>
          <mesh position={[0, 0.02, 0.005]}>
            <sphereGeometry args={[0.017, 16, 8, 0, Math.PI]} />
            <meshStandardMaterial
              color="#eeeeee"
              metalness={0.5}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
        {/* Right half */}
        <group rotation={[-fairingAngle, 0, 0]}>
          <mesh position={[0, 0.02, -0.005]}>
            <sphereGeometry
              args={[0.017, 16, 8, Math.PI, Math.PI]}
            />
            <meshStandardMaterial
              color="#eeeeee"
              metalness={0.5}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* Engine bell */}
      <mesh position={[0, -0.065, 0]}>
        <cylinderGeometry args={[0.008, 0.016, 0.015, 12]} />
        <meshStandardMaterial
          color="#555555"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Exhaust cone glow */}
      {exhaustIntensity > 0 && (
        <>
          <mesh position={[0, -0.09, 0]}>
            <coneGeometry args={[0.022, 0.06, 12]} />
            <meshStandardMaterial
              color="#ff6600"
              emissive="#ff4400"
              emissiveIntensity={exhaustIntensity * 3}
              transparent
              opacity={exhaustIntensity * 0.6}
            />
          </mesh>
          {/* Exhaust particles */}
          <points ref={exhaustRef}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[exhaustPositions, 3]}
              />
            </bufferGeometry>
            <pointsMaterial
              color="#ff8833"
              size={0.004 * scale}
              sizeAttenuation
              transparent
              opacity={exhaustIntensity * 0.7}
              blending={THREE.AdditiveBlending}
            />
          </points>
        </>
      )}

      {/* 4 Fins */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.024,
              -0.05,
              Math.sin(angle) * 0.024,
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.002, 0.025, 0.012]} />
            <meshStandardMaterial
              color="#aaaaaa"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
}
