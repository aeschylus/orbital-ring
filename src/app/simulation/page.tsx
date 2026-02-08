"use client";

import dynamic from "next/dynamic";
import { ControlPanel } from "@/components/dom/ControlPanel";

const SimulationCanvas = dynamic(
  () =>
    import("@/components/canvas/SimulationCanvas").then(
      (mod) => mod.SimulationCanvas,
    ),
  { ssr: false, loading: () => <LoadingScreen /> },
);

function LoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto" />
        <p className="text-gray-400">Initializing simulation...</p>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  return (
    <div className="relative h-screen w-screen">
      <SimulationCanvas />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2">
        <ControlPanel />
      </div>
      <div className="pointer-events-none absolute left-4 top-4">
        <h2 className="text-sm font-semibold text-gray-300">
          Orbital Ring Simulator
        </h2>
        <p className="text-xs text-gray-500">Phase 0 — Bootstrap</p>
      </div>
    </div>
  );
}
