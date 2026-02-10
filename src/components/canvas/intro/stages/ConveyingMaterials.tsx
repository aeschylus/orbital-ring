"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;
const RING_R = R + 400;
const TUBE_R = 80;
const TETHER_COUNT = 8;
const TRAM_PER_TETHER = 2;

interface ConveyingMaterialsProps {
  progress: number;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function ConveyingMaterials({ progress }: ConveyingMaterialsProps) {
  const sceneRef = useRef<THREE.Group>(null);

  const tetherProgress = Math.min(1, progress / 0.4);
  const tramProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.5));
  const secondRingProgress = Math.max(0, (progress - 0.7) / 0.3);

  const tetherLength = easeOutCubic(tetherProgress) * 380;

  const tetherAngles = useMemo(() => {
    return Array.from({ length: TETHER_COUNT }, (_, i) => {
      return -0.25 + (i / (TETHER_COUNT - 1)) * 0.5;
    });
  }, []);

  // Tether line objects
  const tetherLines = useMemo(() => {
    return tetherAngles.map((angle) => {
      const positions = new Float32Array(6);
      const geom = new THREE.BufferGeometry();
      geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: "#aabbdd",
        transparent: true,
        opacity: 0.7,
        linewidth: 2,
      });
      return { line: new THREE.Line(geom, mat), angle };
    });
  }, [tetherAngles]);

  useFrame((_, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.02;
    }

    for (const { line, angle } of tetherLines) {
      const topX = Math.cos(angle) * RING_R;
      const topZ = Math.sin(angle) * RING_R;
      const bottomR = RING_R - tetherLength;
      const bottomX = Math.cos(angle) * bottomR;
      const bottomZ = Math.sin(angle) * bottomR;

      const pos = line.geometry.getAttribute("position") as THREE.BufferAttribute;
      pos.setXYZ(0, topX, 0, topZ);
      pos.setXYZ(1, bottomX, 0, bottomZ);
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={sceneRef}>
      {/* Main ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_R, TUBE_R, 24, 200]} />
        <meshStandardMaterial
          color="#334466"
          emissive="#4488ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Ring glow halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RING_R, TUBE_R + 40, 8, 128]} />
        <meshStandardMaterial
          color="#4488ff"
          emissive="#4488ff"
          emissiveIntensity={1}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Tether lines */}
      {tetherLines.map(({ line }, i) => (
        <primitive key={`tether-${i}`} object={line} />
      ))}

      {/* Tether cylinder fills — thicker visible tethers */}
      {tetherAngles.map((angle, i) => {
        if (tetherLength < 10) return null;
        const topR = RING_R;
        const bottomR = RING_R - tetherLength;
        const midR = (topR + bottomR) / 2;
        const midX = Math.cos(angle) * midR;
        const midZ = Math.sin(angle) * midR;

        // Orient cylinder along the radial direction
        const dir = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

        return (
          <mesh
            key={`tether-cyl-${i}`}
            position={[midX, 0, midZ]}
            quaternion={quat}
          >
            <cylinderGeometry args={[3, 3, tetherLength, 6]} />
            <meshStandardMaterial
              color="#8899bb"
              metalness={0.8}
              roughness={0.2}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* Anchor points at bottom of tethers */}
      {tetherProgress > 0.5 &&
        tetherAngles.map((angle, i) => {
          const anchorR = RING_R - tetherLength;
          const x = Math.cos(angle) * anchorR;
          const z = Math.sin(angle) * anchorR;
          return (
            <mesh key={`anchor-${i}`} position={[x, 0, z]}>
              <sphereGeometry args={[12, 8, 8]} />
              <meshStandardMaterial
                color="#88aacc"
                emissive="#ffffff"
                emissiveIntensity={0.5}
                transparent
                opacity={Math.min(1, (tetherProgress - 0.5) / 0.3) * 0.7}
              />
            </mesh>
          );
        })}

      {/* Climber vehicles ascending tethers */}
      {tramProgress > 0 &&
        tetherAngles.map((angle, ti) =>
          Array.from({ length: TRAM_PER_TETHER }, (_, ci) => {
            const climberDelay =
              (ti * TRAM_PER_TETHER + ci) / (TETHER_COUNT * TRAM_PER_TETHER);
            const localP = Math.max(
              0,
              Math.min(1, (tramProgress - climberDelay * 0.5) / (1 - climberDelay * 0.5)),
            );
            if (localP <= 0) return null;

            const climbFrac = easeOutCubic(localP);
            const climberR = RING_R - tetherLength + tetherLength * climbFrac;
            const x = Math.cos(angle) * climberR;
            const z = Math.sin(angle) * climberR;

            // Orient radially
            const dir = new THREE.Vector3(
              Math.cos(angle),
              0,
              Math.sin(angle),
            );
            const up = new THREE.Vector3(0, 1, 0);
            const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

            return (
              <group key={`tram-${ti}-${ci}`} position={[x, 0, z]} quaternion={quat}>
                {/* Climber body — visible box */}
                <mesh>
                  <boxGeometry args={[10, 15, 8]} />
                  <meshStandardMaterial
                    color="#aa8844"
                    metalness={0.7}
                    roughness={0.3}
                  />
                </mesh>
                {/* Glow */}
                <mesh>
                  <sphereGeometry args={[12, 6, 6]} />
                  <meshStandardMaterial
                    color="#ffaa44"
                    emissive="#ffaa44"
                    emissiveIntensity={1}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              </group>
            );
          }),
        )}

      {/* Second ring strand materializing */}
      {secondRingProgress > 0 && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 40, 0]}>
            <torusGeometry args={[RING_R + 50, TUBE_R * 0.6, 16, 200]} />
            <meshStandardMaterial
              color="#334466"
              emissive="#4488ff"
              emissiveIntensity={secondRingProgress * 1}
              transparent
              opacity={secondRingProgress * 0.35}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 40, 0]}>
            <torusGeometry args={[RING_R + 50, TUBE_R * 0.6 + 30, 8, 128]} />
            <meshStandardMaterial
              color="#4488ff"
              emissive="#4488ff"
              emissiveIntensity={secondRingProgress * 0.6}
              transparent
              opacity={secondRingProgress * 0.08}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
