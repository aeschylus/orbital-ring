import { setup, assign, fromCallback } from "xstate";

export interface SimulationParameters {
  mode: "tethered" | "orbital";
  altitude: number; // km
  ringMass: number; // kg
  tetherCount: number;
  spinRate: number; // rad/s
  showForceVectors: boolean;
  showAtmosphere: boolean;
}

interface SimulationContext {
  time: number;
  timeStep: number;
  speed: number;
  frameCount: number;
  parameters: SimulationParameters;
}

type SimulationEvents =
  | { type: "LOADED" }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "STEP" }
  | { type: "RESET" }
  | { type: "TICK"; delta: number }
  | { type: "SET_SPEED"; speed: number }
  | { type: "SET_PARAMETER"; key: keyof SimulationParameters; value: unknown };

const defaultParameters: SimulationParameters = {
  mode: "tethered",
  altitude: 32,
  ringMass: 1e8,
  tetherCount: 1000,
  spinRate: 0.001,
  showForceVectors: false,
  showAtmosphere: true,
};

export const simulationMachine = setup({
  types: {} as {
    context: SimulationContext;
    events: SimulationEvents;
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
  actions: {
    advanceTime: assign(({ context, event }) => {
      if (event.type !== "TICK") return {};
      const dt = event.delta * context.speed;
      return {
        time: context.time + dt,
        frameCount: context.frameCount + 1,
      };
    }),
    stepOnce: assign(({ context }) => ({
      time: context.time + context.timeStep,
      frameCount: context.frameCount + 1,
    })),
    resetTime: assign({
      time: 0,
      frameCount: 0,
    }),
    setSpeed: assign(({ event }) => {
      if (event.type !== "SET_SPEED") return {};
      return { speed: event.speed };
    }),
    setParameter: assign(({ context, event }) => {
      if (event.type !== "SET_PARAMETER") return {};
      return {
        parameters: {
          ...context.parameters,
          [event.key]: event.value,
        },
      };
    }),
  },
}).createMachine({
  id: "simulation",
  initial: "loading",
  context: {
    time: 0,
    timeStep: 1 / 60,
    speed: 1,
    frameCount: 0,
    parameters: defaultParameters,
  },
  on: {
    SET_SPEED: { actions: "setSpeed" },
    SET_PARAMETER: { actions: "setParameter" },
  },
  states: {
    loading: {
      on: { LOADED: "idle" },
    },
    idle: {
      on: { PLAY: "running" },
    },
    running: {
      invoke: {
        src: "ticker",
        id: "ticker",
        input: ({}) => ({}),
      },
      on: {
        TICK: { actions: "advanceTime" },
        PAUSE: "paused",
        RESET: { target: "idle", actions: "resetTime" },
      },
    },
    paused: {
      on: {
        PLAY: "running",
        STEP: { actions: "stepOnce" },
        RESET: { target: "idle", actions: "resetTime" },
      },
    },
  },
});
