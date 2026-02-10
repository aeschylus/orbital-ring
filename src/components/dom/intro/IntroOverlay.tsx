"use client";

import { IntroContext } from "@/providers/IntroProvider";
import { STAGES } from "@/lib/intro/stageDefinitions";
import { StageIndicator } from "./StageIndicator";
import { IntroControls } from "./IntroControls";

export function IntroOverlay() {
  const currentStage = IntroContext.useSelector(
    (state) => state.context.currentStage,
  );
  const stageProgress = IntroContext.useSelector(
    (state) => state.context.stageProgress,
  );
  const isComplete = IntroContext.useSelector(
    (state) => state.value === "complete",
  );

  if (isComplete) return null;

  const stage = STAGES[currentStage];
  if (!stage) return null;

  // Fade text in (0-0.1) and out (0.9-1.0)
  let textOpacity = 1;
  if (stageProgress < 0.1) {
    textOpacity = stageProgress / 0.1;
  } else if (stageProgress > 0.9) {
    textOpacity = (1 - stageProgress) / 0.1;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Stage text - bottom left */}
      <div
        className="absolute bottom-24 left-8 max-w-md transition-opacity duration-300"
        style={{ opacity: textOpacity }}
      >
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-blue-400">
          Stage {stage.id} of {STAGES.length}
        </p>
        <h2 className="mb-1 text-3xl font-bold text-white">{stage.title}</h2>
        <p className="mb-2 text-lg text-blue-200">{stage.subtitle}</p>
        <p className="text-sm leading-relaxed text-gray-300">
          {stage.description}
        </p>
      </div>

      {/* Stage indicator dots - bottom center */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <StageIndicator />
      </div>

      {/* Controls - bottom right */}
      <div className="pointer-events-auto absolute bottom-8 right-8">
        <IntroControls />
      </div>
    </div>
  );
}
