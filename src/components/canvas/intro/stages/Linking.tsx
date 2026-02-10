"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SatelliteGeometry } from "../geometry/SatelliteGeometry";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;

interface LinkingProps {
  progress: number;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function Linking({ progress }: LinkingProps) {
  // Phase 1 (0-0.5): Two satellites approach
  // Phase 2 (0.5-0.7): Dock with flash
  // Phase 3 (0.7-1.0): Arc of linked segments becomes visible

  const approachProgress = Math.min(1, progress / 0.5);
  const dockProgress = progress > 0.5 ? Math.min(1, (progress - 0.5) / 0.2) : 0;
  const arcProgress = progress > 0.7 ? (progress - 0.7) / 0.3 : 0;

  // Gap between the two satellites closes
  const gap = 40 * (1 - easeInOutCubic(approachProgress));

  // Coupling pulse intensifies during approach
  const couplingPulse =
    progress < 0.7
      ? Math.sin(progress * Math.PI * 14) * 0.4 + 0.4 * approachProgress
      : 1.0;

  // Flash at dock moment
  const dockFlash = dockProgress > 0 && dockProgress < 0.3 ? (0.3 - dockProgress) / 0.3 : 0;
  const emGlow = dockProgress;

  // Arc geometry (ring segment visible at macro pull-back)
  const arcLine = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const arcR = R + 400;
    const arcSpan = Math.PI * 0.5;
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = -arcSpan / 2 + (i / segments) * arcSpan;
      points.push(new THREE.Vector3(Math.cos(angle) * arcR, 0, Math.sin(angle) * arcR));
    }
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({ color: "#4488ff", transparent: true, opacity: 0 });
    return { obj: new THREE.Line(geom, mat), totalPoints: segments + 1 };
  }, []);

  useFrame(() => {
    const mat = arcLine.obj.material as THREE.LineBasicMaterial;
    mat.opacity = arcProgress * 0.8;
    arcLine.obj.geometry.setDrawRange(0, Math.floor(arcProgress * arcLine.totalPoints));
  });

  const arcSegmentCount = 16;

  return (
    <group>
      {/* Docking pair at ring altitude */}
      <group position={[0, 0, R + 400]}>
        {/* Lighting */}
        <pointLight position={[25, 12, 20]} intensity={1.2} distance={150} />
        <pointLight position={[-15, -8, -15]} intensity={0.3} distance={150} color="#aaccff" />

        {/* Left satellite */}
        <group position={[0, -gap / 2, 0]}>
          <SatelliteGeometry
            unfoldProgress={1}
            scale={100}
            emissiveIntensity={emGlow * 2}
            couplingPulse={couplingPulse}
          />
        </group>

        {/* Right satellite (flipped) */}
        <group position={[0, gap / 2, 0]} rotation={[Math.PI, 0, 0]}>
          <SatelliteGeometry
            unfoldProgress={1}
            scale={100}
            emissiveIntensity={emGlow * 2}
            couplingPulse={couplingPulse}
          />
        </group>

        {/* Dock flash */}
        {dockFlash > 0 && (
          <mesh>
            <sphereGeometry args={[8, 16, 16]} />
            <meshStandardMaterial
              color="#88bbff"
              emissive="#4488ff"
              emissiveIntensity={dockFlash * 8}
              transparent
              opacity={dockFlash * 0.9}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* EM coupling energy */}
        {emGlow > 0.1 && (
          <mesh>
            <cylinderGeometry args={[3, 3, 5, 12]} />
            <meshStandardMaterial
              color="#4488ff"
              emissive="#4488ff"
              emissiveIntensity={emGlow * 5}
              transparent
              opacity={emGlow * 0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>

      {/* Arc of linked segments (fades in during pull-back) */}
      <primitive object={arcLine.obj} />

      {/* Dot markers along the arc */}
      {arcProgress > 0 &&
        Array.from({ length: arcSegmentCount }, (_, i) => {
          const arcR = R + 400;
          const arcSpan = Math.PI * 0.5;
          const angle = -arcSpan / 2 + (i / (arcSegmentCount - 1)) * arcSpan;
          if (i / arcSegmentCount > arcProgress) return null;
          return (
            <mesh
              key={`arc-${i}`}
              position={[Math.cos(angle) * arcR, 0, Math.sin(angle) * arcR]}
            >
              <sphereGeometry args={[15, 8, 8]} />
              <meshStandardMaterial
                color="#88aacc"
                emissive="#4488ff"
                emissiveIntensity={0.8}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          );
        })}
    </group>
  );
}
