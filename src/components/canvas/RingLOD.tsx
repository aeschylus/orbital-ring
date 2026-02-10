"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SimulationContext } from "@/providers/SimulationProvider";
import { useWorldOrigin } from "./CameraRelativeGroup";
import { Ring } from "./Ring";
import { Tethers } from "./Tethers";

type LODLevel = "FAR" | "MEDIUM" | "CLOSE" | "DETAIL";

// Thresholds in km
const THRESHOLDS = {
  DETAIL: 100,
  CLOSE: 1_000,
  MEDIUM: 10_000,
} as const;

// Hysteresis factor: ±10%
const HYSTERESIS = 0.1;

function getThresholdWithHysteresis(
  base: number,
  currentLevel: LODLevel,
  targetLevel: LODLevel,
): number {
  // When transitioning to a more detailed level (closer), use lower threshold (easier to enter)
  // When transitioning to a less detailed level (farther), use higher threshold (harder to leave)
  const levelOrder: LODLevel[] = ["DETAIL", "CLOSE", "MEDIUM", "FAR"];
  const currentIdx = levelOrder.indexOf(currentLevel);
  const targetIdx = levelOrder.indexOf(targetLevel);

  if (targetIdx < currentIdx) {
    // Going to more detail — lower threshold to enter
    return base * (1 - HYSTERESIS);
  }
  // Going to less detail — higher threshold to leave
  return base * (1 + HYSTERESIS);
}

function computeLODLevel(distance: number, currentLevel: LODLevel): LODLevel {
  if (distance < getThresholdWithHysteresis(THRESHOLDS.DETAIL, currentLevel, "DETAIL")) {
    return "DETAIL";
  }
  if (distance < getThresholdWithHysteresis(THRESHOLDS.CLOSE, currentLevel, "CLOSE")) {
    return "CLOSE";
  }
  if (distance < getThresholdWithHysteresis(THRESHOLDS.MEDIUM, currentLevel, "MEDIUM")) {
    return "MEDIUM";
  }
  return "FAR";
}

/** Glowing line circle for very far distances */
function FarRing() {
  const altitude = SimulationContext.useSelector(
    (state) => state.context.parameters.altitude,
  );
  const ringRadius = (EARTH.RADIUS_KM + altitude) * SCALE.KM_TO_SCENE;

  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, 0, Math.sin(angle) * ringRadius));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [ringRadius]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="#4fc3f7" linewidth={2} />
    </lineLoop>
  );
}

export function RingLOD() {
  const [lodLevel, setLodLevel] = useState<LODLevel>("FAR");
  const { getWorldOrigin } = useWorldOrigin();

  const altitude = SimulationContext.useSelector(
    (state) => state.context.parameters.altitude,
  );

  const ringRadius = (EARTH.RADIUS_KM + altitude) * SCALE.KM_TO_SCENE;
  const ringCenter = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    // Compute distance from camera to nearest ring point
    // Ring is a circle in the XZ plane at y=0, centered at origin
    const worldOrigin = getWorldOrigin();

    // Camera position in world coordinates
    const camWorld = camera.position.clone().add(worldOrigin);

    // Project camera onto XZ plane and find distance to ring circle
    const camXZ = new THREE.Vector2(camWorld.x, camWorld.z);
    const distToAxis = camXZ.length();
    const distToRingXZ = Math.abs(distToAxis - ringRadius);
    const distToRing = Math.sqrt(distToRingXZ * distToRingXZ + camWorld.y * camWorld.y);

    const newLevel = computeLODLevel(distToRing, lodLevel);
    if (newLevel !== lodLevel) {
      setLodLevel(newLevel);
    }
  });

  return (
    <group>
      {lodLevel === "FAR" && <FarRing />}
      {lodLevel === "MEDIUM" && (
        <>
          <Ring tubularSegments={64} radialSegments={8} />
          <Tethers maxVisible={200} />
        </>
      )}
      {lodLevel === "CLOSE" && (
        <>
          <Ring tubularSegments={128} radialSegments={16} />
          <Tethers maxVisible={500} />
        </>
      )}
      {lodLevel === "DETAIL" && (
        <>
          <Ring tubularSegments={256} radialSegments={32} />
          <Tethers />
        </>
      )}
    </group>
  );
}
