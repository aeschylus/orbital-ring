import * as THREE from "three";
import { EARTH, SCALE } from "@/lib/constants/physical";

const R = EARTH.RADIUS_KM * SCALE.KM_TO_SCENE;

export interface CameraKeyframe {
  position: THREE.Vector3;
  target: THREE.Vector3;
  fov: number;
}

export type CameraPath = CameraKeyframe[];

// Camera distances are tuned for visibility at each stage's scale:
// - Micro stages (1, 4, 5): camera 30-80 units from subject
// - Macro stages (2, 3, 6, 7): camera at R*1.2 - R*2.5

export const CAMERA_PATHS: Record<string, CameraPath> = {
  // Stage 1: Close-up of single satellite. Camera orbits around it at ~40 units.
  satelliteDesign: [
    {
      position: new THREE.Vector3(0, 10, R + 440),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 40,
    },
    {
      position: new THREE.Vector3(25, 15, R + 425),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 38,
    },
    {
      position: new THREE.Vector3(35, -5, R + 415),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 36,
    },
  ],

  // Stage 2: Pull back to show Earth with rockets rising. Transition from close to macro.
  bulkLaunches: [
    {
      position: new THREE.Vector3(35, -5, R + 415),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 36,
    },
    {
      position: new THREE.Vector3(R * 0.3, R * 0.2, R * 1.6),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
    {
      position: new THREE.Vector3(R * 0.5, R * 0.4, R * 1.5),
      target: new THREE.Vector3(0, 0, 0),
      fov: 55,
    },
  ],

  // Stage 3: Top-down-ish view, watching ring form around equator.
  orbitalPhasing: [
    {
      position: new THREE.Vector3(R * 0.5, R * 0.4, R * 1.5),
      target: new THREE.Vector3(0, 0, 0),
      fov: 55,
    },
    {
      position: new THREE.Vector3(R * 0.2, R * 1.8, R * 0.3),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
    {
      position: new THREE.Vector3(0, R * 2.0, R * 0.1),
      target: new THREE.Vector3(0, 0, 0),
      fov: 45,
    },
  ],

  // Stage 4: Zoom back in for satellite unfold close-up. Camera ~60 units out.
  deployment: [
    {
      position: new THREE.Vector3(0, R * 2.0, R * 0.1),
      target: new THREE.Vector3(0, 0, 0),
      fov: 45,
    },
    {
      position: new THREE.Vector3(30, 20, R + 460),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 36,
    },
    {
      position: new THREE.Vector3(-20, 10, R + 450),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 34,
    },
  ],

  // Stage 5: Two satellites docking close-up, then pull back to show arc.
  linking: [
    {
      position: new THREE.Vector3(-20, 10, R + 450),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 34,
    },
    {
      position: new THREE.Vector3(40, 5, R + 430),
      target: new THREE.Vector3(0, 0, R + 400),
      fov: 38,
    },
    {
      position: new THREE.Vector3(R * 0.3, R * 0.3, R * 1.2),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
  ],

  // Stage 6: Ring view — camera close enough to see the ring tube and particles.
  rotorAcceleration: [
    {
      position: new THREE.Vector3(R * 0.3, R * 0.3, R * 1.2),
      target: new THREE.Vector3(0, 0, 0),
      fov: 50,
    },
    {
      position: new THREE.Vector3(R * 0.4, R * 0.15, R * 1.15),
      target: new THREE.Vector3(0, 0, 0),
      fov: 48,
    },
    {
      position: new THREE.Vector3(R * 0.6, R * 0.4, R * 1.0),
      target: new THREE.Vector3(0, 0, 0),
      fov: 52,
    },
  ],

  // Stage 7: Pull out to see full ring, tethers descending.
  bootstrapRedundancy: [
    {
      position: new THREE.Vector3(R * 0.6, R * 0.4, R * 1.0),
      target: new THREE.Vector3(0, 0, 0),
      fov: 52,
    },
    {
      position: new THREE.Vector3(R * 0.8, R * 0.6, R * 0.8),
      target: new THREE.Vector3(0, R * 0.05, 0),
      fov: 50,
    },
    {
      position: new THREE.Vector3(R * 0.5, R * 1.0, R * 0.6),
      target: new THREE.Vector3(0, 0, 0),
      fov: 48,
    },
  ],
};

const _curveCache = new Map<string, THREE.CatmullRomCurve3>();

export function getCameraAtProgress(
  stageKey: string,
  progress: number,
): CameraKeyframe {
  const path = CAMERA_PATHS[stageKey];
  if (!path || path.length === 0) {
    return {
      position: new THREE.Vector3(0, 0, R * 2.5),
      target: new THREE.Vector3(0, 0, 0),
      fov: 45,
    };
  }

  const t = Math.max(0, Math.min(1, progress));

  // Build or retrieve CatmullRomCurve3 for positions
  if (!_curveCache.has(stageKey)) {
    const points = path.map((kf) => kf.position.clone());
    const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
    _curveCache.set(stageKey, curve);
  }
  const curve = _curveCache.get(stageKey)!;
  const position = curve.getPointAt(t);

  // Lerp target and FOV across keyframes
  const segmentCount = path.length - 1;
  const scaledT = t * segmentCount;
  const segIndex = Math.min(Math.floor(scaledT), segmentCount - 1);
  const segT = scaledT - segIndex;

  const target = path[segIndex].target
    .clone()
    .lerp(path[segIndex + 1].target, segT);
  const fov =
    path[segIndex].fov + (path[segIndex + 1].fov - path[segIndex].fov) * segT;

  return { position, target, fov };
}
