"use client";

import { Html, Line } from "@react-three/drei";
import { useMemo } from "react";

interface AnnotationProps {
  anchor: [number, number, number];
  label: string;
  offset?: [number, number, number];
}

export function Annotation({
  anchor,
  label,
  offset = [0.8, 0.6, 0],
}: AnnotationProps) {
  const endPoint: [number, number, number] = useMemo(
    () => [
      anchor[0] + offset[0],
      anchor[1] + offset[1],
      anchor[2] + offset[2],
    ],
    [anchor, offset]
  );

  return (
    <group>
      {/* Small dot at anchor point */}
      <mesh position={anchor}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Leader line from anchor to label */}
      <Line
        points={[anchor, endPoint]}
        color="white"
        lineWidth={1}
        opacity={0.6}
        transparent
      />

      {/* Label at the end of the leader line */}
      <Html
        position={endPoint}
        style={{ pointerEvents: "none" }}
        center
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            color: "white",
            padding: "2px 8px",
            borderRadius: "4px",
            fontSize: "11px",
            fontFamily: "monospace",
            whiteSpace: "nowrap",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            userSelect: "none",
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}
