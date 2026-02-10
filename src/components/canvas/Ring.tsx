"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SimulationContext } from "@/providers/SimulationProvider";

interface RingProps {
  tubularSegments?: number;
  radialSegments?: number;
}

export function Ring({ tubularSegments = 256, radialSegments = 32 }: RingProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const altitude = SimulationContext.useSelector(
    (state) => state.context.parameters.altitude,
  );
  const isRunning = SimulationContext.useSelector(
    (state) => state.value === "running",
  );

  const ringRadius =
    (EARTH.RADIUS_KM + altitude) * SCALE.KM_TO_SCENE;

  const ringGeometry = useMemo(() => {
    return new THREE.TorusGeometry(ringRadius, 2 * SCALE.KM_TO_SCENE, radialSegments, tubularSegments);
  }, [ringRadius, radialSegments, tubularSegments]);

  useFrame((_, delta) => {
    if (ringRef.current && isRunning) {
      ringRef.current.rotation.z += 0.01 * delta;
    }
  });

  return (
    <mesh ref={ringRef} geometry={ringGeometry} rotation={[Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color="#4fc3f7"
        emissive="#1565c0"
        emissiveIntensity={0.3}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}
