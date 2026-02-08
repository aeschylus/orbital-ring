"use client";

import { useMemo, useRef, useEffect } from "react";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SimulationContext } from "@/providers/SimulationProvider";

export function Tethers() {
  const altitude = SimulationContext.useSelector(
    (state) => state.context.parameters.altitude,
  );
  const tetherCount = SimulationContext.useSelector(
    (state) => state.context.parameters.tetherCount,
  );
  const groupRef = useRef<THREE.Group>(null);

  const displayCount = Math.min(tetherCount, 100);

  const geometry = useMemo(() => {
    const earthR = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;
    const ringR = (EARTH.RADIUS_KM + altitude) * SCALE.KM_TO_SCENE;

    const positions: number[] = [];

    for (let i = 0; i < displayCount; i++) {
      const angle = (i / displayCount) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      // Surface point
      positions.push(cos * earthR, 0, sin * earthR);
      // Ring point
      positions.push(cos * ringR, 0, sin * ringR);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geo;
  }, [altitude, displayCount]);

  return (
    <lineSegments ref={groupRef} geometry={geometry}>
      <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
    </lineSegments>
  );
}
