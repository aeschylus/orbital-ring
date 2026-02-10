"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";
import { RocketGeometry } from "../geometry/RocketGeometry";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;
const ROCKET_COUNT = 7;
const MAX_ALTITUDE = 500;

interface BulkLaunchesProps {
  progress: number;
}

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

interface RocketConfig {
  longitude: number;
  latitude: number;
  launchDelay: number;
  deployAlt: number;
}

export function BulkLaunches({ progress }: BulkLaunchesProps) {
  const rockets = useMemo<RocketConfig[]>(() => [
    { longitude: -0.12, latitude: 0.04, launchDelay: 0, deployAlt: 0.6 },
    { longitude: -0.04, latitude: -0.02, launchDelay: 0.08, deployAlt: 0.65 },
    { longitude: 0.04, latitude: 0.01, launchDelay: 0.14, deployAlt: 0.55 },
    { longitude: 0.12, latitude: -0.03, launchDelay: 0.05, deployAlt: 0.7 },
    { longitude: 0.20, latitude: 0.02, launchDelay: 0.20, deployAlt: 0.6 },
    { longitude: -0.20, latitude: -0.01, launchDelay: 0.12, deployAlt: 0.65 },
    { longitude: 0.28, latitude: 0.03, launchDelay: 0.25, deployAlt: 0.58 },
  ], []);

  return (
    <group>
      {rockets.map((config, i) => {
        const rocketProgress = Math.max(
          0,
          Math.min(1, (progress - config.launchDelay) / (1 - config.launchDelay)),
        );

        if (rocketProgress <= 0) return null;

        const altFraction = easeOutQuad(rocketProgress);
        const altitude = R + altFraction * MAX_ALTITUDE;

        const fairingOpen =
          altFraction > config.deployAlt
            ? Math.min(1, (altFraction - config.deployAlt) / 0.15)
            : 0;

        const exhaust = rocketProgress < 0.8 ? 1 : (1 - rocketProgress) / 0.2;

        const theta = config.longitude;
        const phi = config.latitude;
        const x = Math.cos(phi) * Math.sin(theta) * altitude;
        const y = Math.sin(phi) * altitude;
        const z = Math.cos(phi) * Math.cos(theta) * altitude;

        const dir = new THREE.Vector3(x, y, z).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

        return (
          <group key={i} position={[x, y, z]} quaternion={quat}>
            {/* Scale 1500 so rockets are ~180 units tall, visible at macro distances */}
            <RocketGeometry
              scale={1500}
              exhaustIntensity={exhaust}
              fairingOpen={fairingOpen}
            />
          </group>
        );
      })}

      {/* Bright exhaust trail markers — glowing spheres at launch sites for visibility */}
      {rockets.map((config, i) => {
        const rocketProgress = Math.max(
          0,
          Math.min(1, (progress - config.launchDelay) / (1 - config.launchDelay)),
        );
        if (rocketProgress <= 0) return null;

        const theta = config.longitude;
        const phi = config.latitude;
        const trailAlt = R + easeOutQuad(rocketProgress) * MAX_ALTITUDE * 0.5;
        const tx = Math.cos(phi) * Math.sin(theta) * trailAlt;
        const ty = Math.sin(phi) * trailAlt;
        const tz = Math.cos(phi) * Math.cos(theta) * trailAlt;

        return (
          <mesh key={`trail-${i}`} position={[tx, ty, tz]}>
            <sphereGeometry args={[40, 8, 8]} />
            <meshStandardMaterial
              color="#ff6622"
              emissive="#ff4400"
              emissiveIntensity={3}
              transparent
              opacity={0.6 * (rocketProgress < 0.8 ? 1 : (1 - rocketProgress) / 0.2)}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
