"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { SimulationContext } from "@/providers/SimulationProvider";

interface TethersProps {
  maxVisible?: number;
}

export function Tethers({ maxVisible }: TethersProps) {
  const altitude = SimulationContext.useSelector(
    (state) => state.context.parameters.altitude,
  );
  const tetherCount = SimulationContext.useSelector(
    (state) => state.context.parameters.tetherCount,
  );
  const showTethers = SimulationContext.useSelector(
    (state) => state.context.parameters.showTethers,
  );

  const displayCount = maxVisible ? Math.min(tetherCount, maxVisible) : tetherCount;

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

  if (!showTethers || displayCount === 0) return null;

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#ffffff" opacity={0.2} transparent />
    </lineSegments>
  );
}
