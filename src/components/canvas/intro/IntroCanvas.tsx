"use client";

import { Canvas } from "@react-three/fiber";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { IntroScene } from "./IntroScene";

export function IntroCanvas() {
  return (
    <Canvas
      camera={{
        position: [0, 10, EARTH.RADIUS_KM * SCALE.KM_TO_SCENE + 440],
        fov: 40,
        near: 0.1,
        far: 500_000,
      }}
      gl={{ logarithmicDepthBuffer: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <IntroScene />
    </Canvas>
  );
}
