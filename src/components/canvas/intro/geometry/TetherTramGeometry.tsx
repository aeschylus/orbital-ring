"use client";

import { useRef } from "react";
import * as THREE from "three";

interface TetherTramGeometryProps {
  scale?: number;
}

export function TetherTramGeometry({ scale = 1 }: TetherTramGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main carriage body */}
      <mesh>
        <boxGeometry args={[0.04, 0.06, 0.03]} />
        <meshStandardMaterial
          color="#aa8844"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Gripper mechanism (top) */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial
          color="#666666"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Cargo pod (bottom) */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[0.03, 0.02, 0.025]} />
        <meshStandardMaterial
          color="#556677"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
