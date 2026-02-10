"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { DiagramCanvas } from "./DiagramCanvas";
import { Annotation } from "./Annotation";

function FilamentParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 80;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (i / count) * 4 - 2; // spread along tube length
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.06;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += delta * 1.5;
      if (arr[i * 3] > 2) {
        arr[i * 3] = -2;
      }
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
        color="#00ffaa"
        size={0.04}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function AcceleratorTube() {
  return (
    <group>
      {/* Outer hull — semi-transparent */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 4, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#6688aa"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.5}
        />
      </mesh>

      {/* Inner vacuum bore */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 4.02, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#446688"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          roughness={0.5}
        />
      </mesh>

      {/* Bore centerline (dashed) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 4.2, 4]} />
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function EMCouplingRing({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      {/* Outer ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.28, 0.03, 12, 32]} />
        <meshStandardMaterial
          color="#2266ff"
          emissive="#1144cc"
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Inner ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.22, 0.02, 12, 32]} />
        <meshStandardMaterial
          color="#3388ff"
          emissive="#2266dd"
          emissiveIntensity={0.4}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

function FoldedScaffold() {
  const panels = useMemo(() => {
    const items: { x: number; angle: number }[] = [];
    const panelCount = 12;
    for (let i = 0; i < panelCount; i++) {
      items.push({
        x: (i / panelCount) * 3.6 - 1.8,
        angle: i % 2 === 0 ? 0.3 : -0.3,
      });
    }
    return items;
  }, []);

  return (
    <group position={[0, 0.28, 0]}>
      {panels.map((p, i) => (
        <mesh
          key={i}
          position={[p.x, 0, 0]}
          rotation={[p.angle, 0, 0]}
        >
          <boxGeometry args={[0.28, 0.01, 0.15]} />
          <meshStandardMaterial
            color="#bbaa66"
            metalness={0.4}
            roughness={0.4}
            emissive="#332200"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
      {/* Crease lines along scaffold */}
      {panels.map((p, i) => (
        <mesh
          key={`crease-${i}`}
          position={[p.x + 0.14, 0.005, 0]}
        >
          <boxGeometry args={[0.005, 0.015, 0.16]} />
          <meshBasicMaterial color="#ddcc88" />
        </mesh>
      ))}
    </group>
  );
}

function SolarPanel({ position, rotation }: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[0.4, 0.005, 0.2]} />
      <meshStandardMaterial
        color="#2244aa"
        metalness={0.3}
        roughness={0.5}
        emissive="#112266"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

function ThermalShield() {
  return (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.35, 0.35, 3.8, 32, 1, true]} />
      <meshBasicMaterial
        color="#88aacc"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function ThrusterCluster() {
  const angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  return (
    <group position={[-2.05, 0, 0]}>
      {angles.map((a, i) => (
        <mesh
          key={i}
          position={[0, Math.cos(a) * 0.18, Math.sin(a) * 0.18]}
          rotation={[0, 0, -Math.PI / 2]}
        >
          <coneGeometry args={[0.04, 0.12, 8]} />
          <meshStandardMaterial
            color="#dd8844"
            metalness={0.5}
            roughness={0.3}
            emissive="#442200"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function SatelliteScene() {
  return (
    <>
      <AcceleratorTube />
      <FilamentParticles />
      <EMCouplingRing x={2.05} />
      <EMCouplingRing x={-2.05} />
      <FoldedScaffold />
      <ThermalShield />
      <ThrusterCluster />

      {/* Solar panels — folded flat against scaffold */}
      <SolarPanel position={[0.5, 0.35, 0.18]} rotation={[0, 0, 0]} />
      <SolarPanel position={[0.5, 0.35, -0.18]} rotation={[0, 0, 0]} />
      <SolarPanel position={[-0.5, 0.35, 0.18]} rotation={[0, 0, 0]} />
      <SolarPanel position={[-0.5, 0.35, -0.18]} rotation={[0, 0, 0]} />

      {/* Annotations */}
      <Annotation
        anchor={[0, 0.25, 0.25]}
        label="Accelerator Tube"
        offset={[0.4, 0.8, 0.6]}
      />
      <Annotation
        anchor={[0, 0.15, 0]}
        label="Vacuum Bore"
        offset={[-0.5, 0.7, 0.8]}
      />
      <Annotation
        anchor={[0.3, 0.28, 0]}
        label="Folded Scaffold"
        offset={[0.6, 0.5, -0.5]}
      />
      <Annotation
        anchor={[0, 0, 0]}
        label="Inertial Filament"
        offset={[-0.8, -0.5, 0.6]}
      />
      <Annotation
        anchor={[2.05, 0.28, 0]}
        label="EM Coupling Ring"
        offset={[0.5, 0.6, 0.4]}
      />
      <Annotation
        anchor={[0.5, 0.36, 0.18]}
        label="Solar Panel Array"
        offset={[0.3, 0.5, 0.5]}
      />
      <Annotation
        anchor={[-2.05, 0.18, 0]}
        label="Attitude Thrusters"
        offset={[-0.6, 0.5, 0.4]}
      />
    </>
  );
}

export function SatelliteDesignDiagram() {
  return (
    <DiagramCanvas cameraPosition={[3, 2, 5]}>
      <SatelliteScene />
    </DiagramCanvas>
  );
}
