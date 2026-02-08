"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
  }
`;

export function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const radius = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;

  const atmosphereMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: atmosphereFragmentShader,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      }),
    [],
  );

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += EARTH.ROTATION_RATE * delta;
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color="#1a5276" roughness={0.8} />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial}>
        <sphereGeometry args={[radius * 1.02, 64, 64]} />
      </mesh>
    </group>
  );
}
