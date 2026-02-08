"use client";

import { createActorContext } from "@xstate/react";
import { simulationMachine } from "@/machines/simulationMachine";

export const SimulationContext = createActorContext(simulationMachine);

export function SimulationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SimulationContext.Provider>{children}</SimulationContext.Provider>;
}
