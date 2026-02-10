"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

interface DiagramCanvasProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

export function DiagramCanvas({
  children,
  cameraPosition = [4, 3, 6],
}: DiagramCanvasProps) {
  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border border-gray-700/50">
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 40,
          near: 0.01,
          far: 200,
        }}
        gl={{ antialias: true }}
        style={{ width: "100%", height: "100%", background: "#0a0a0f" }}
      >
        <ambientLight intensity={0.8} />
        <hemisphereLight args={["#b1c8e0", "#2a2a3a", 0.6]} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#6699cc" />
        <directionalLight position={[0, -2, 4]} intensity={0.4} color="#ffffff" />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={20}
        />
        {children}
      </Canvas>
    </div>
  );
}
