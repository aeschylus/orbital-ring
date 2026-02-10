"use client";

import { createActorContext } from "@xstate/react";
import { introMachine } from "@/machines/introMachine";

export const IntroContext = createActorContext(introMachine);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  return <IntroContext.Provider>{children}</IntroContext.Provider>;
}
