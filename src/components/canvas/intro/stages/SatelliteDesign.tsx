"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SatelliteGeometry } from "../geometry/SatelliteGeometry";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;

interface SatelliteDesignProps {
  progress: number;
}

export function SatelliteDesign({ progress }: SatelliteDesignProps) {
  const spinRef = useRef<THREE.Group>(null);

  // Satellite tumbles slowly so viewer sees all sides
  useFrame((_, delta) => {
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.3;
      spinRef.current.rotation.x += delta * 0.08;
    }
  });

  // Coupling rings pulse gently
  const couplingPulse = Math.sin(progress * Math.PI * 6) * 0.3 + 0.3;

  // Hint at unfold near end of stage
  const hintUnfold = progress > 0.7 ? ((progress - 0.7) / 0.3) * 0.15 : 0;

  return (
    <group position={[0, 0, R + 400]}>
      {/* Local lighting for detail */}
      <pointLight position={[20, 15, 25]} intensity={1.2} distance={150} />
      <pointLight position={[-15, -8, -20]} intensity={0.4} distance={150} color="#aaccff" />
      <pointLight position={[0, 0, -30]} intensity={0.3} distance={150} color="#6688bb" />

      <group ref={spinRef} rotation={[0.2, 0, 0.1]}>
        <SatelliteGeometry
          unfoldProgress={hintUnfold}
          scale={150}
          emissiveIntensity={0.5}
          couplingPulse={couplingPulse}
        />
      </group>
    </group>
  );
}
