"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DiagramCanvas } from "./DiagramCanvas";
import { Annotation } from "./Annotation";

function SatelliteUnit({ x, flip }: { x: number; flip?: boolean }) {
  const scaleX = flip ? -1 : 1;
  return (
    <group position={[x, 0, 0]} scale={[scaleX, 1, 1]}>
      {/* Tube body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 1.8, 24]} />
        <meshStandardMaterial color="#7799bb" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* EM coupling end */}
      <mesh position={[0.95, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.025, 12, 24]} />
        <meshStandardMaterial
          color="#4499ff"
          emissive="#3377ee"
          emissiveIntensity={0.6}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {/* Solar panels deployed */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.8, 0.005, 0.5]} />
        <meshStandardMaterial color="#2244aa" metalness={0.3} roughness={0.5} emissive="#112266" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, -0.35, 0]}>
        <boxGeometry args={[0.8, 0.005, 0.5]} />
        <meshStandardMaterial color="#2244aa" metalness={0.3} roughness={0.5} emissive="#112266" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}

function EMFieldVisualization() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.3 + Math.sin(t * 3 + i * 0.8) * 0.15;
    });
  });

  return (
    <group ref={ref}>
      {[0.15, 0.25, 0.35].map((r, i) => (
        <mesh key={i} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[r, 0.008, 8, 32]} />
          <meshBasicMaterial
            color="#66aaff"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function AlignmentSensors() {
  return (
    <group>
      {[0.12, -0.12].map((y, i) =>
        [0.12, -0.12].map((z, j) => (
          <mesh key={`${i}-${j}`} position={[0, y, z]}>
            <boxGeometry args={[0.03, 0.03, 0.03]} />
            <meshStandardMaterial
              color="#00ff66"
              emissive="#00cc44"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function LinkingScene() {
  return (
    <>
      <SatelliteUnit x={-1.1} />
      <SatelliteUnit x={1.1} flip />
      <EMFieldVisualization />
      <AlignmentSensors />

      <Annotation
        anchor={[0, 0.22, 0]}
        label="EM Coupling Interface"
        offset={[0.6, 0.8, 0.4]}
      />
      <Annotation
        anchor={[0, 0, 0.2]}
        label="Tube Joint Seal"
        offset={[-0.7, 0.5, 0.7]}
      />
      <Annotation
        anchor={[0, 0.12, 0.12]}
        label="Alignment Sensors"
        offset={[0.8, 0.3, 0.6]}
      />
      <Annotation
        anchor={[0, -0.2, 0]}
        label="Structural Latch"
        offset={[-0.6, -0.5, 0.5]}
      />
    </>
  );
}

export function LinkingDiagram() {
  return (
    <DiagramCanvas cameraPosition={[3, 2, 4]}>
      <LinkingScene />
    </DiagramCanvas>
  );
}
