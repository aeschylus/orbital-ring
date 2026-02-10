"use client";

import { IntroContext } from "@/providers/IntroProvider";
import { STAGES } from "@/lib/intro/stageDefinitions";

export function StageIndicator() {
  const currentStage = IntroContext.useSelector(
    (state) => state.context.currentStage,
  );
  const stageProgress = IntroContext.useSelector(
    (state) => state.context.stageProgress,
  );

  return (
    <div className="flex items-center gap-2">
      {STAGES.map((stage, i) => {
        const isActive = i === currentStage;
        const isComplete = i < currentStage;

        return (
          <div key={stage.id} className="flex items-center gap-2">
            <div className="relative">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-blue-400"
                    : isComplete
                      ? "w-2 bg-blue-500"
                      : "w-2 bg-white/20"
                }`}
              />
              {/* Progress fill for active dot */}
              {isActive && (
                <div
                  className="absolute inset-0 h-2 rounded-full bg-blue-200"
                  style={{ width: `${stageProgress * 100}%` }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
