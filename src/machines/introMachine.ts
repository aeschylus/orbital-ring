import { setup, assign, fromCallback } from "xstate";
import { STAGES } from "@/lib/intro/stageDefinitions";

export interface IntroContext {
  currentStage: number; // 0-indexed
  stageProgress: number; // 0-1 within current stage
  stageElapsed: number; // seconds elapsed in current stage
  globalProgress: number; // 0-1 across all stages
  isPaused: boolean;
}

type IntroEvents =
  | { type: "LOADED" }
  | { type: "TICK"; delta: number }
  | { type: "PAUSE" }
  | { type: "PLAY" }
  | { type: "SKIP_STAGE" }
  | { type: "PREV_STAGE" }
  | { type: "SKIP_ALL" };

function computeGlobalProgress(stageIndex: number, stageProgress: number): number {
  const totalDuration = STAGES.reduce((sum, s) => sum + s.duration, 0);
  const elapsed =
    STAGES.slice(0, stageIndex).reduce((sum, s) => sum + s.duration, 0) +
    STAGES[stageIndex].duration * stageProgress;
  return elapsed / totalDuration;
}

export const introMachine = setup({
  types: {} as {
    context: IntroContext;
    events: IntroEvents;
  },
  actors: {
    ticker: fromCallback(({ sendBack }) => {
      let animFrameId: number;
      let lastTime = performance.now();

      const tick = (now: number) => {
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        sendBack({ type: "TICK", delta });
        animFrameId = requestAnimationFrame(tick);
      };

      animFrameId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(animFrameId);
      };
    }),
  },
  guards: {
    hasNextStage: ({ context }) => context.currentStage < STAGES.length - 1,
    hasPrevStage: ({ context }) => context.currentStage > 0,
  },
  actions: {
    advanceStage: assign(({ context, event }) => {
      if (event.type !== "TICK") return {};
      const stage = STAGES[context.currentStage];
      const newElapsed = context.stageElapsed + event.delta;
      const newProgress = Math.min(newElapsed / stage.duration, 1);

      return {
        stageElapsed: newElapsed,
        stageProgress: newProgress,
        globalProgress: computeGlobalProgress(context.currentStage, newProgress),
      };
    }),
    goNextStage: assign(({ context }) => {
      const nextStage = Math.min(context.currentStage + 1, STAGES.length - 1);
      return {
        currentStage: nextStage,
        stageProgress: 0,
        stageElapsed: 0,
        globalProgress: computeGlobalProgress(nextStage, 0),
      };
    }),
    goPrevStage: assign(({ context }) => {
      const prevStage = Math.max(context.currentStage - 1, 0);
      return {
        currentStage: prevStage,
        stageProgress: 0,
        stageElapsed: 0,
        globalProgress: computeGlobalProgress(prevStage, 0),
      };
    }),
  },
}).createMachine({
  id: "intro",
  initial: "loading",
  context: {
    currentStage: 0,
    stageProgress: 0,
    stageElapsed: 0,
    globalProgress: 0,
    isPaused: false,
  },
  states: {
    loading: {
      on: { LOADED: "playing" },
    },
    playing: {
      invoke: {
        src: "ticker",
        id: "introTicker",
        input: ({}) => ({}),
      },
      on: {
        TICK: [
          {
            guard: ({ context, event }) => {
              if (event.type !== "TICK") return false;
              const stage = STAGES[context.currentStage];
              return context.stageElapsed + event.delta >= stage.duration &&
                context.currentStage < STAGES.length - 1;
            },
            actions: ["advanceStage", "goNextStage"],
          },
          {
            guard: ({ context, event }) => {
              if (event.type !== "TICK") return false;
              const stage = STAGES[context.currentStage];
              return context.stageElapsed + event.delta >= stage.duration &&
                context.currentStage >= STAGES.length - 1;
            },
            target: "complete",
            actions: "advanceStage",
          },
          {
            actions: "advanceStage",
          },
        ],
        PAUSE: "paused",
        SKIP_STAGE: [
          {
            guard: "hasNextStage",
            actions: "goNextStage",
          },
          {
            target: "complete",
          },
        ],
        PREV_STAGE: {
          guard: "hasPrevStage",
          actions: "goPrevStage",
        },
        SKIP_ALL: "complete",
      },
    },
    paused: {
      entry: assign({ isPaused: true }),
      exit: assign({ isPaused: false }),
      on: {
        PLAY: "playing",
        SKIP_STAGE: [
          {
            guard: "hasNextStage",
            target: "playing",
            actions: "goNextStage",
          },
          {
            target: "complete",
          },
        ],
        PREV_STAGE: {
          guard: "hasPrevStage",
          target: "playing",
          actions: "goPrevStage",
        },
        SKIP_ALL: "complete",
      },
    },
    complete: {
      type: "final",
    },
  },
});
