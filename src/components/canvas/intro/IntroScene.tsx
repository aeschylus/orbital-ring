"use client";

import { useEffect } from "react";
import { Stars } from "@react-three/drei";
import { IntroContext } from "@/providers/IntroProvider";
import { STAGES } from "@/lib/intro/stageDefinitions";
import { IntroEarth } from "./IntroEarth";
import { CameraChoreographer } from "./CameraChoreographer";
import { StageTransition } from "./StageTransition";

// Stage components
import { SatelliteDesign } from "./stages/SatelliteDesign";
import { BulkLaunches } from "./stages/BulkLaunches";
import { SatellitesLiningUp } from "./stages/SatellitesLiningUp";
import { Unfolding } from "./stages/Unfolding";
import { Linking } from "./stages/Linking";
import { AcceleratingMass } from "./stages/AcceleratingMass";
import { ConveyingMaterials } from "./stages/ConveyingMaterials";

const STAGE_COMPONENTS: Record<string, React.ComponentType<{ progress: number }>> = {
  satelliteDesign: SatelliteDesign,
  bulkLaunches: BulkLaunches,
  orbitalPhasing: SatellitesLiningUp,
  deployment: Unfolding,
  linking: Linking,
  rotorAcceleration: AcceleratingMass,
  bootstrapRedundancy: ConveyingMaterials,
};

export function IntroScene() {
  const actorRef = IntroContext.useActorRef();
  const currentStage = IntroContext.useSelector(
    (state) => state.context.currentStage,
  );
  const stageProgress = IntroContext.useSelector(
    (state) => state.context.stageProgress,
  );

  useEffect(() => {
    actorRef.send({ type: "LOADED" });
  }, [actorRef]);

  const stage = STAGES[currentStage];
  const StageComponent = stage ? STAGE_COMPONENTS[stage.key] : null;

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[50000, 30000, 50000]} intensity={1.5} />
      <pointLight position={[0, 0, 0]} intensity={0.05} />
      <Stars
        radius={100000}
        depth={50000}
        count={5000}
        factor={100}
        saturation={0}
      />
      <IntroEarth />
      <CameraChoreographer />
      <StageTransition />
      {StageComponent && <StageComponent progress={stageProgress} />}
    </>
  );
}
