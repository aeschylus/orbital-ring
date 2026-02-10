"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SatelliteGeometry } from "../geometry/SatelliteGeometry";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;

interface UnfoldingProps {
  progress: number;
}

export function Unfolding({ progress }: UnfoldingProps) {
  const spinRef = useRef<THREE.Group>(null);

  // Very slow rotation during unfold
  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.15;
    }
  });

  // Coupling rings pulse when they activate (progress > 0.65)
  const couplingPulse =
    progress > 0.65
      ? Math.sin((progress - 0.65) * Math.PI * 14) * 0.5 + 0.5
      : 0;

  return (
    <group position={[0, 0, R + 400]}>
      {/* Strong local lighting for clear detail */}
      <pointLight position={[25, 18, 30]} intensity={1.5} distance={200} />
      <pointLight position={[-18, -10, -25]} intensity={0.4} distance={200} color="#aaccff" />
      <pointLight position={[0, 0, -40]} intensity={0.3} distance={200} color="#6688bb" />

      <group ref={spinRef} rotation={[0.25, 0, 0.12]}>
        <SatelliteGeometry
          unfoldProgress={progress}
          scale={150}
          emissiveIntensity={1.5}
          couplingPulse={couplingPulse}
        />
      </group>
    </group>
  );
}
