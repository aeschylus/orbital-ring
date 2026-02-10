"use client";

import * as THREE from "three";
import { DiagramCanvas } from "./DiagramCanvas";
import { Annotation } from "./Annotation";

function RingStrands() {
  const strandOffsets: [number, number][] = [
    [-0.2, 0.2],
    [0.2, 0.2],
    [-0.2, -0.2],
    [0.2, -0.2],
  ];

  return (
    <group>
      {strandOffsets.map(([y, z], i) => (
        <group key={i}>
          {/* Strand tube */}
          <mesh position={[0, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.08, 0.08, 5, 16]} />
            <meshStandardMaterial
              color="#7799bb"
              metalness={0.4}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Cross-bracing between strands */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <group key={`brace-${i}`} position={[x, 0, 0]}>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.4} />
          </mesh>
          <mesh rotation={[-Math.PI / 4, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
            <meshStandardMaterial color="#aaaaaa" metalness={0.3} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function TransitTrack() {
  return (
    <group position={[0, 0.4, 0]}>
      {/* Rail */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.04, 5, 0.04]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Rail supports */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, -0.1, 0]}>
          <boxGeometry args={[0.03, 0.2, 0.03]} />
          <meshStandardMaterial color="#999999" metalness={0.3} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function TetherTramVehicle() {
  return (
    <group position={[0.5, 0.55, 0]}>
      {/* Main cabin */}
      <mesh>
        <boxGeometry args={[0.4, 0.15, 0.15]} />
        <meshStandardMaterial color="#ee8844" metalness={0.3} roughness={0.4} emissive="#553300" emissiveIntensity={0.2} />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 0.02, 0.076]}>
        <boxGeometry args={[0.3, 0.06, 0.002]} />
        <meshStandardMaterial
          color="#aaddff"
          emissive="#6699cc"
          emissiveIntensity={0.5}
          metalness={0.2}
          roughness={0.1}
        />
      </mesh>
      {/* Bogies */}
      <mesh position={[-0.12, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.06]} />
        <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.3} />
      </mesh>
      <mesh position={[0.12, -0.08, 0]}>
        <boxGeometry args={[0.08, 0.03, 0.06]} />
        <meshStandardMaterial color="#777777" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
}

function TetherStation() {
  return (
    <group position={[-1.2, -0.3, 0]}>
      {/* Station platform */}
      <mesh>
        <boxGeometry args={[0.5, 0.05, 0.4]} />
        <meshStandardMaterial color="#8888aa" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Tether descending */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 2, 6]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Station tower */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.08, 0.4, 0.08]} />
        <meshStandardMaterial color="#8899aa" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Anchor at bottom of tether */}
      <mesh position={[0, -2.0, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.12]} />
        <meshStandardMaterial color="#777777" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function InfrastructureScene() {
  return (
    <>
      <RingStrands />
      <TransitTrack />
      <TetherTramVehicle />
      <TetherStation />

      {/* Ground plane */}
      <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial
          color="#446644"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      <Annotation
        anchor={[1.0, 0.2, 0.2]}
        label="Ring Strands"
        offset={[0.6, 0.7, 0.5]}
      />
      <Annotation
        anchor={[0.5, 0.55, 0.08]}
        label="TetherTram Vehicle"
        offset={[0.7, 0.5, 0.4]}
      />
      <Annotation
        anchor={[0, 0.42, 0]}
        label="Transit Track"
        offset={[-0.7, 0.6, 0.4]}
      />
      <Annotation
        anchor={[-1.2, -0.3, 0.2]}
        label="Tether Station"
        offset={[-0.8, 0.4, 0.5]}
      />
    </>
  );
}

export function InfrastructureDiagram() {
  return (
    <DiagramCanvas cameraPosition={[4, 2, 5]}>
      <InfrastructureScene />
    </DiagramCanvas>
  );
}
