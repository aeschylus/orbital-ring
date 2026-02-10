"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;
const ORBIT_R = R + 400;
const SAT_COUNT = 120;

interface SatellitesLiningUpProps {
  progress: number;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

export function SatellitesLiningUp({ progress }: SatellitesLiningUpProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.InstancedMesh>(null);
  const tempMatrix = useMemo(() => new THREE.Matrix4(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  // Sphere geometry — each satellite is a visible glowing dot
  const dotGeom = useMemo(() => new THREE.SphereGeometry(1, 8, 8), []);
  const glowGeom = useMemo(() => new THREE.SphereGeometry(1, 6, 6), []);

  const satellites = useMemo(() => {
    return Array.from({ length: SAT_COUNT }, (_, i) => {
      const targetAngle = (i / SAT_COUNT) * Math.PI * 2;
      return {
        startAngle: targetAngle + (Math.random() - 0.5) * 1.5,
        startInclination: (Math.random() - 0.5) * 0.5,
        startR: ORBIT_R + (Math.random() - 0.5) * 500,
        targetAngle,
        delay: Math.random() * 0.3,
      };
    });
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    for (let i = 0; i < SAT_COUNT; i++) {
      const sat = satellites[i];
      const localP = Math.max(0, Math.min(1, (progress - sat.delay) / (1 - sat.delay)));
      const eased = easeInOutQuad(localP);

      const angle = sat.startAngle + (sat.targetAngle - sat.startAngle) * eased;
      const r = sat.startR + (ORBIT_R - sat.startR) * eased;
      const incl = sat.startInclination * (1 - eased);

      const x = Math.cos(angle) * Math.cos(incl) * r;
      const y = Math.sin(incl) * r;
      const z = Math.sin(angle) * Math.cos(incl) * r;

      // Solid dot: 20 units radius
      tempMatrix.makeTranslation(x, y, z);
      tempMatrix.scale(new THREE.Vector3(20, 20, 20));
      meshRef.current.setMatrixAt(i, tempMatrix);

      // Color: orange scattered → blue-white settled
      tempColor.setRGB(1 - eased * 0.5, 0.6 + eased * 0.35, 0.4 + eased * 0.6);
      meshRef.current.setColorAt(i, tempColor);

      // Ion thruster glow (larger, additive) — visible while maneuvering
      if (glowRef.current) {
        const thrusterActive = localP > 0.01 && localP < 0.85;
        const glowScale = thrusterActive ? 40 : 0;
        const glowMatrix = new THREE.Matrix4().makeTranslation(x, y, z);
        glowMatrix.scale(new THREE.Vector3(glowScale, glowScale, glowScale));
        glowRef.current.setMatrixAt(i, glowMatrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    if (glowRef.current) glowRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {/* Satellite body dots */}
      <instancedMesh ref={meshRef} args={[dotGeom, undefined, SAT_COUNT]}>
        <meshStandardMaterial
          metalness={0.9}
          roughness={0.1}
          vertexColors
          emissive="#446688"
          emissiveIntensity={0.3}
        />
      </instancedMesh>

      {/* Ion thruster glow halos */}
      <instancedMesh ref={glowRef} args={[glowGeom, undefined, SAT_COUNT]}>
        <meshStandardMaterial
          color="#4488ff"
          emissive="#4488ff"
          emissiveIntensity={2}
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>
    </group>
  );
}
