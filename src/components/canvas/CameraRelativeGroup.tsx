"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface WorldOriginContextValue {
  /** Accumulated world-space offset (the "true" origin in scene coords) */
  getWorldOrigin: () => THREE.Vector3;
}

const WorldOriginContext = createContext<WorldOriginContextValue | null>(null);

export function useWorldOrigin() {
  const ctx = useContext(WorldOriginContext);
  if (!ctx) throw new Error("useWorldOrigin must be used inside CameraRelativeGroup");
  return ctx;
}

const REBASE_THRESHOLD = 1000; // km — rebase when camera drifts this far from origin
const _tempVec = new THREE.Vector3();

export function CameraRelativeGroup({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const worldOriginRef = useRef(new THREE.Vector3());
  const { controls } = useThree();

  const contextValue = useRef<WorldOriginContextValue>({
    getWorldOrigin: () => worldOriginRef.current,
  }).current;

  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    const dist = camera.position.length();
    if (dist > REBASE_THRESHOLD) {
      // Shift everything so camera ends up near origin
      _tempVec.copy(camera.position);

      // Accumulate into world origin
      worldOriginRef.current.add(_tempVec);

      // Shift the group in the opposite direction
      groupRef.current.position.sub(_tempVec);

      // Shift camera
      camera.position.set(0, 0, 0);

      // Shift OrbitControls target
      if (controls && "target" in controls) {
        const orbitTarget = (controls as { target: THREE.Vector3 }).target;
        orbitTarget.sub(_tempVec);
      }
    }
  }, -100); // Run before OrbitControls (default priority 0)

  return (
    <WorldOriginContext.Provider value={contextValue}>
      <group ref={groupRef}>{children}</group>
    </WorldOriginContext.Provider>
  );
}
