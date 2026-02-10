"use client";

import { DiagramCanvas } from "./DiagramCanvas";
import { Annotation } from "./Annotation";

function RingStrandCrossSection({ x }: { x: number }) {
  return (
    <group position={[x, 1.5, 0]}>
      {/* Outer ring structure */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.08, 12, 24]} />
        <meshStandardMaterial color="#7799bb" metalness={0.4} roughness={0.3} />
      </mesh>
      {/* Inner bore */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.04, 12, 24]} />
        <meshStandardMaterial
          color="#5577aa"
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      {/* Active particle glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.02, 8, 24]} />
        <meshBasicMaterial color="#ff8866" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function TetherCable() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main cable */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Cable attachment at top */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#999999" metalness={0.4} roughness={0.3} />
      </mesh>
    </group>
  );
}

function ClimberVehicle() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.25, 0.3, 0.2]} />
        <meshStandardMaterial color="#ee9944" metalness={0.3} roughness={0.4} emissive="#553300" emissiveIntensity={0.2} />
      </mesh>
      {/* Gripper mechanism */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[0.12, 0.06, 0.08]} />
        <meshStandardMaterial color="#bbbbbb" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Payload bay */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#cc9944" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

function BootstrapScene() {
  return (
    <>
      {/* Two ring strand cross-sections */}
      <RingStrandCrossSection x={-0.5} />
      <RingStrandCrossSection x={0.5} />

      {/* Cross-beam between strands */}
      <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 6]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Tether descending from between the strands */}
      <TetherCable />

      {/* Climber vehicle on the tether */}
      <ClimberVehicle />

      {/* Ground reference */}
      <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshStandardMaterial
          color="#446644"
          transparent
          opacity={0.4}
        />
      </mesh>

      <Annotation
        anchor={[-0.5, 1.5, 0.35]}
        label="First Strand"
        offset={[-0.7, 0.5, 0.4]}
      />
      <Annotation
        anchor={[0.5, 1.5, 0.35]}
        label="Second Strand"
        offset={[0.7, 0.5, 0.4]}
      />
      <Annotation
        anchor={[0, 0.8, 0.02]}
        label="Tether Cable"
        offset={[0.8, 0.2, 0.5]}
      />
      <Annotation
        anchor={[0.13, 0, 0.1]}
        label="Climber Vehicle"
        offset={[0.7, -0.3, 0.5]}
      />
    </>
  );
}

export function BootstrapDiagram() {
  return (
    <DiagramCanvas cameraPosition={[3, 1.5, 5]}>
      <BootstrapScene />
    </DiagramCanvas>
  );
}
