"use client";

import * as THREE from "three";
import { DiagramCanvas } from "./DiagramCanvas";
import { Annotation } from "./Annotation";

function Booster() {
  return (
    <group position={[0, -1.5, 0]}>
      {/* Main body */}
      <mesh>
        <cylinderGeometry args={[0.35, 0.4, 1.8, 24]} />
        <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Engine bells */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh
          key={i}
          position={[Math.cos(a) * 0.2, -0.95, Math.sin(a) * 0.2]}
        >
          <coneGeometry args={[0.08, 0.2, 8]} />
          <meshStandardMaterial color="#777777" metalness={0.6} roughness={0.3} />
        </mesh>
      ))}
      {/* Fins */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh
          key={`fin-${i}`}
          position={[Math.cos(a) * 0.38, -0.7, Math.sin(a) * 0.38]}
          rotation={[0, -a, 0]}
        >
          <boxGeometry args={[0.02, 0.4, 0.15]} />
          <meshStandardMaterial color="#999999" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function SecondStage() {
  return (
    <group position={[0, -0.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.35, 1.0, 24]} />
        <meshStandardMaterial color="#dddddd" metalness={0.5} roughness={0.3} />
      </mesh>
      {/* Interstage line */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.352, 0.352, 0.02, 24]} />
        <meshStandardMaterial color="#999999" />
      </mesh>
    </group>
  );
}

function PayloadFairing() {
  return (
    <group position={[0, 0.9, 0]}>
      {/* Fairing — semi-transparent to show satellite stack */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.3, 0.8, 24]} />
        <meshPhysicalMaterial
          color="#ddddef"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          roughness={0.3}
          metalness={0.3}
        />
      </mesh>
      {/* Fairing base ring */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
        <meshStandardMaterial color="#888888" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

function SatelliteStack() {
  return (
    <group position={[0, 0.7, 0]}>
      {[0, 0.18, 0.36].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshStandardMaterial
            color="#5588bb"
            metalness={0.4}
            roughness={0.4}
            emissive="#112244"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function RocketScene() {
  return (
    <>
      <Booster />
      <SecondStage />
      <PayloadFairing />
      <SatelliteStack />

      <Annotation
        anchor={[0, 1.2, 0.15]}
        label="Payload Fairing"
        offset={[0.8, 0.4, 0.5]}
      />
      <Annotation
        anchor={[0, 0.85, 0.12]}
        label="Satellite Stack"
        offset={[-0.8, 0.3, 0.6]}
      />
      <Annotation
        anchor={[0, -0.2, 0.32]}
        label="Second Stage"
        offset={[0.8, 0.0, 0.5]}
      />
      <Annotation
        anchor={[0, -1.5, 0.38]}
        label="Booster"
        offset={[0.7, -0.2, 0.5]}
      />
    </>
  );
}

export function LaunchCampaignDiagram() {
  return (
    <DiagramCanvas cameraPosition={[3, 1, 4]}>
      <RocketScene />
    </DiagramCanvas>
  );
}
