"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { IntroContext } from "@/providers/IntroProvider";

// Full-screen fade-to-black quad rendered in screen space
export function StageTransition() {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  const stageProgress = IntroContext.useSelector(
    (state) => state.context.stageProgress,
  );

  useFrame(() => {
    if (!materialRef.current) return;

    // Fade in at start of stage (0-0.05) and fade out at end (0.95-1.0)
    let opacity = 0;
    if (stageProgress < 0.05) {
      opacity = 1 - stageProgress / 0.05;
    } else if (stageProgress > 0.95) {
      opacity = (stageProgress - 0.95) / 0.05;
    }

    materialRef.current.opacity = opacity;
    materialRef.current.visible = opacity > 0.001;
  });

  return (
    <mesh renderOrder={9999}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        ref={materialRef}
        color="black"
        transparent
        opacity={0}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
