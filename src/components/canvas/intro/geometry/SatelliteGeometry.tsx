"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";

interface SatelliteGeometryProps {
  unfoldProgress?: number; // 0 (folded) to 1 (unfolded)
  scale?: number;
  emissiveIntensity?: number;
  couplingPulse?: number; // 0-1, pulsing glow on coupling rings
}

// Staggered sub-animation: returns 0-1 for a sub-range of overall progress
function subProgress(progress: number, start: number, end: number): number {
  return Math.max(0, Math.min(1, (progress - start) / (end - start)));
}

// Smooth easing for mechanical feel
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function SatelliteGeometry({
  unfoldProgress = 0,
  scale = 1,
  emissiveIntensity = 0,
  couplingPulse = 0,
}: SatelliteGeometryProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Staggered sub-animations with easing
  const capProgress = easeInOutCubic(subProgress(unfoldProgress, 0, 0.2));
  const tubeProgress = easeInOutCubic(subProgress(unfoldProgress, 0.1, 0.5));
  const panelProgress = easeInOutCubic(subProgress(unfoldProgress, 0.35, 0.75));
  const glowProgress = subProgress(unfoldProgress, 0.65, 1.0);

  // Tube extends from compact (0.08) to full length (0.4)
  const tubeLength = 0.08 + tubeProgress * 0.32;
  const halfTube = tubeLength / 2;

  // End caps separate outward
  const capSeparation = capProgress * 0.04;

  // Panels unfold from body (0°) to perpendicular (90°)
  const panelAngle = panelProgress * Math.PI * 0.5;

  // Coupling ring glow
  const ringGlow = Math.max(glowProgress * emissiveIntensity, couplingPulse);

  // Materials
  const bodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9aabb8",
        metalness: 0.92,
        roughness: 0.12,
      }),
    [],
  );

  const innerTubeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#556677",
        metalness: 0.95,
        roughness: 0.08,
        side: THREE.BackSide,
      }),
    [],
  );

  const panelFrontMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a2d5a",
        metalness: 0.3,
        roughness: 0.5,
      }),
    [],
  );

  const panelBackMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#334455",
        metalness: 0.6,
        roughness: 0.3,
      }),
    [],
  );

  const radiatorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ccccdd",
        metalness: 0.7,
        roughness: 0.25,
      }),
    [],
  );

  return (
    <group ref={groupRef} scale={scale}>
      {/* === MAIN TUBE (rotor channel) === */}
      {/* Outer hull — visible cylinder */}
      <mesh material={bodyMat}>
        <cylinderGeometry args={[0.028, 0.028, tubeLength, 24]} />
      </mesh>
      {/* Inner bore — darker interior visible through ends */}
      <mesh material={innerTubeMat}>
        <cylinderGeometry args={[0.022, 0.022, tubeLength + 0.002, 16]} />
      </mesh>

      {/* === TELESCOPING SECTIONS (3 rings that slide apart) === */}
      {[0.3, 0, -0.3].map((frac, i) => {
        const yPos = frac * tubeLength;
        return (
          <mesh key={`ring-${i}`} material={bodyMat} position={[0, yPos, 0]}>
            <torusGeometry args={[0.03, 0.003, 8, 24]} />
            <meshStandardMaterial
              color="#7a8a98"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        );
      })}

      {/* === END CAPS (separate outward during unfold) === */}
      {/* Top cap */}
      <group position={[0, halfTube + capSeparation, 0]}>
        {/* Cap body */}
        <mesh material={bodyMat}>
          <cylinderGeometry args={[0.035, 0.028, 0.012, 24]} />
        </mesh>
        {/* Cap rim */}
        <mesh position={[0, 0.007, 0]}>
          <torusGeometry args={[0.035, 0.002, 8, 24]} />
          <meshStandardMaterial
            color="#8899aa"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
      {/* Bottom cap */}
      <group position={[0, -halfTube - capSeparation, 0]}>
        <mesh material={bodyMat}>
          <cylinderGeometry args={[0.028, 0.035, 0.012, 24]} />
        </mesh>
        <mesh position={[0, -0.007, 0]}>
          <torusGeometry args={[0.035, 0.002, 8, 24]} />
          <meshStandardMaterial
            color="#8899aa"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* === ELECTROMAGNETIC COUPLING RINGS (glow when active) === */}
      {/* Top coupling assembly */}
      <group position={[0, halfTube + capSeparation + 0.015, 0]}>
        <mesh>
          <torusGeometry args={[0.038, 0.006, 12, 32]} />
          <meshStandardMaterial
            color="#3366cc"
            emissive="#4488ff"
            emissiveIntensity={ringGlow}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        {/* Inner coupling ring */}
        <mesh>
          <torusGeometry args={[0.028, 0.004, 8, 32]} />
          <meshStandardMaterial
            color="#2255bb"
            emissive="#6699ff"
            emissiveIntensity={ringGlow * 0.7}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>
      {/* Bottom coupling assembly */}
      <group position={[0, -halfTube - capSeparation - 0.015, 0]}>
        <mesh>
          <torusGeometry args={[0.038, 0.006, 12, 32]} />
          <meshStandardMaterial
            color="#3366cc"
            emissive="#4488ff"
            emissiveIntensity={ringGlow}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.028, 0.004, 8, 32]} />
          <meshStandardMaterial
            color="#2255bb"
            emissive="#6699ff"
            emissiveIntensity={ringGlow * 0.7}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* === SOLAR PANELS (4 panels, fold outward like petals) === */}
      {[0, 1, 2, 3].map((i) => {
        const baseAngle = (i * Math.PI) / 2;
        // Hinge point on the tube surface
        const hingeX = Math.cos(baseAngle) * 0.029;
        const hingeZ = Math.sin(baseAngle) * 0.029;
        // Panel unfolds around the hinge axis (tangent to tube)
        const hingeTangentX = -Math.sin(baseAngle);
        const hingeTangentZ = Math.cos(baseAngle);

        return (
          <group key={`panel-${i}`} position={[hingeX, 0, hingeZ]}>
            {/* Hinge bracket */}
            <mesh material={bodyMat}>
              <boxGeometry args={[0.004, 0.015, 0.004]} />
            </mesh>
            {/* Panel rotates outward from hinge */}
            <group
              rotation={[
                hingeTangentX * panelAngle,
                0,
                hingeTangentZ * panelAngle,
              ]}
            >
              {/* Panel offset so it rotates from its edge */}
              <group
                position={[
                  Math.cos(baseAngle) * 0.04,
                  0,
                  Math.sin(baseAngle) * 0.04,
                ]}
              >
                {/* Solar cell face (dark blue) */}
                <mesh
                  material={panelFrontMat}
                  position={[0, 0.001, 0]}
                >
                  <boxGeometry args={[0.075, 0.001, 0.035]} />
                </mesh>
                {/* Backing (lighter) */}
                <mesh
                  material={panelBackMat}
                  position={[0, -0.001, 0]}
                >
                  <boxGeometry args={[0.075, 0.001, 0.035]} />
                </mesh>
                {/* Panel cell grid lines */}
                {[-0.025, 0, 0.025].map((xOff, j) => (
                  <mesh
                    key={`grid-${i}-${j}`}
                    position={[xOff, 0.0018, 0]}
                  >
                    <boxGeometry args={[0.001, 0.0005, 0.034]} />
                    <meshStandardMaterial color="#0a1533" />
                  </mesh>
                ))}
              </group>
            </group>
          </group>
        );
      })}

      {/* === RADIATOR FINS (2 small fins, always deployed) === */}
      {[0, 1].map((i) => {
        const angle = Math.PI * 0.25 + i * Math.PI;
        const x = Math.cos(angle) * 0.03;
        const z = Math.sin(angle) * 0.03;
        const finExtend = 0.005 + panelProgress * 0.01;
        return (
          <mesh
            key={`fin-${i}`}
            material={radiatorMat}
            position={[
              x + Math.cos(angle) * finExtend,
              tubeLength * 0.3,
              z + Math.sin(angle) * finExtend,
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.02, 0.008, 0.001]} />
          </mesh>
        );
      })}

      {/* === THRUSTER NOZZLES (4 tiny cones at the bottom) === */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * Math.PI) / 2 + Math.PI * 0.25;
        const x = Math.cos(angle) * 0.025;
        const z = Math.sin(angle) * 0.025;
        return (
          <mesh
            key={`thruster-${i}`}
            position={[x, -halfTube - capSeparation - 0.025, z]}
            rotation={[Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3]}
          >
            <coneGeometry args={[0.004, 0.008, 6]} />
            <meshStandardMaterial
              color="#777788"
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Simplified satellite for instanced rendering (stages 2, 3, 5)
export function createSatelliteBufferGeometry(): THREE.BufferGeometry {
  const body = new THREE.CylinderGeometry(0.028, 0.028, 0.1, 8);
  const cap1 = new THREE.CylinderGeometry(0.035, 0.028, 0.012, 8);
  cap1.translate(0, 0.056, 0);
  const cap2 = new THREE.CylinderGeometry(0.028, 0.035, 0.012, 8);
  cap2.translate(0, -0.056, 0);

  // Merge into single geometry
  const merged = new THREE.BufferGeometry();
  const geometries = [body, cap1, cap2];
  const positions: number[] = [];
  const normals: number[] = [];
  for (const g of geometries) {
    const pos = g.getAttribute("position");
    const norm = g.getAttribute("normal");
    for (let i = 0; i < pos.count; i++) {
      positions.push(pos.getX(i), pos.getY(i), pos.getZ(i));
      normals.push(norm.getX(i), norm.getY(i), norm.getZ(i));
    }
  }
  merged.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  merged.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(normals, 3),
  );
  return merged;
}
