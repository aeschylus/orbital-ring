"use client";

import { useControls, folder } from "leva";
import { useRef } from "react";
import { SimulationContext } from "@/providers/SimulationProvider";
import type { SimulationParameters } from "@/machines/simulationMachine";

export function ParameterPanel() {
  const actorRef = SimulationContext.useActorRef();
  const parameters = SimulationContext.useSelector(
    (state) => state.context.parameters,
  );

  // Prevent feedback loops: skip Leva onChange when syncing from XState
  const skipSync = useRef(false);

  const sendParam = (key: keyof SimulationParameters, value: unknown) => {
    if (skipSync.current) return;
    actorRef.send({ type: "SET_PARAMETER", key, value });
  };

  useControls("Simulation", () => ({
    mode: {
      value: parameters.mode,
      options: { "Tethered Ring": "tethered" as const, "Orbital Ring": "orbital" as const },
      onChange: (v: "tethered" | "orbital") => {
        if (skipSync.current) return;
        actorRef.send({ type: "SET_PARAMETER", key: "mode", value: v });
        // Auto-update altitude based on mode
        const newAlt = v === "tethered" ? 32 : 400;
        actorRef.send({ type: "SET_PARAMETER", key: "altitude", value: newAlt });
      },
    },
    altitude: {
      value: parameters.altitude,
      min: 10,
      max: 1000,
      step: 1,
      suffix: " km",
      onChange: (v: number) => sendParam("altitude", v),
    },
    tetherCount: {
      value: parameters.tetherCount,
      min: 0,
      max: 5000,
      step: 10,
      label: "Tether Count",
      onChange: (v: number) => sendParam("tetherCount", v),
    },
    spinRate: {
      value: parameters.spinRate,
      min: 0,
      max: 0.1,
      step: 0.0001,
      label: "Spin Rate (rad/s)",
      onChange: (v: number) => sendParam("spinRate", v),
    },
  }), [parameters.mode]);

  useControls("Visibility", () => ({
    showAtmosphere: {
      value: parameters.showAtmosphere,
      label: "Atmosphere",
      onChange: (v: boolean) => sendParam("showAtmosphere", v),
    },
    showTethers: {
      value: parameters.showTethers,
      label: "Tethers",
      onChange: (v: boolean) => sendParam("showTethers", v),
    },
    showForceVectors: {
      value: parameters.showForceVectors,
      label: "Force Vectors",
      onChange: (v: boolean) => sendParam("showForceVectors", v),
    },
  }), []);

  return null; // Leva renders its own panel
}
