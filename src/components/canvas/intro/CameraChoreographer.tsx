"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { IntroContext } from "@/providers/IntroProvider";
import { STAGES } from "@/lib/intro/stageDefinitions";
import { getCameraAtProgress } from "@/lib/intro/cameraKeyframes";

export function CameraChoreographer() {
  const camera = useThree((state) => state.camera);

  const currentStage = IntroContext.useSelector(
    (state) => state.context.currentStage,
  );
  const stageProgress = IntroContext.useSelector(
    (state) => state.context.stageProgress,
  );

  useFrame(() => {
    const stage = STAGES[currentStage];
    if (!stage) return;

    const { position, target, fov } = getCameraAtProgress(
      stage.key,
      stageProgress,
    );

    // Smooth camera interpolation
    camera.position.lerp(position, 0.08);

    camera.lookAt(target);

    if ("fov" in camera && typeof (camera as THREE.PerspectiveCamera).fov === "number") {
      const perspCam = camera as THREE.PerspectiveCamera;
      perspCam.fov += (fov - perspCam.fov) * 0.08;
      perspCam.updateProjectionMatrix();
    }
  });

  return null;
}
