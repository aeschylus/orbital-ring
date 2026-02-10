"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Stats } from "@react-three/drei";
import { Earth } from "./Earth";
import { RingLOD } from "./RingLOD";
import { CameraRelativeGroup } from "./CameraRelativeGroup";
import { SimulationContext } from "@/providers/SimulationProvider";
import { useEffect } from "react";
import { EARTH, SCALE } from "@/lib/constants/physical";

function Scene() {
  const actorRef = SimulationContext.useActorRef();

  useEffect(() => {
    actorRef.send({ type: "LOADED" });
  }, [actorRef]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[50000, 30000, 50000]} intensity={1.5} />
      <OrbitControls
        makeDefault
        minDistance={EARTH.RADIUS_KM * SCALE.KM_TO_SCENE * 1.01}
        maxDistance={EARTH.RADIUS_KM * SCALE.KM_TO_SCENE * 5}
        enableDamping
        dampingFactor={0.05}
      />
      <CameraRelativeGroup>
        <Stars
          radius={100000}
          depth={50000}
          count={5000}
          factor={100}
          saturation={0}
        />
        <Earth />
        <RingLOD />
      </CameraRelativeGroup>
      <Stats />
    </>
  );
}

export function SimulationCanvas() {
  return (
    <Canvas
      camera={{
        position: [0, 0, EARTH.RADIUS_KM * SCALE.KM_TO_SCENE * 2.5],
        fov: 45,
        near: 0.1,
        far: 1_000_000,
      }}
      gl={{ logarithmicDepthBuffer: true, antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
