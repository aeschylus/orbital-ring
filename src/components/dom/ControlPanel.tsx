"use client";

import { SimulationContext } from "@/providers/SimulationProvider";

export function ControlPanel() {
  const actorRef = SimulationContext.useActorRef();
  const state = SimulationContext.useSelector((state) => state.value);
  const time = SimulationContext.useSelector((state) => state.context.time);
  const speed = SimulationContext.useSelector((state) => state.context.speed);

  const isRunning = state === "running";
  const isPaused = state === "paused";
  const isIdle = state === "idle" || state === "loading";

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-lg bg-black/70 px-4 py-2 backdrop-blur-sm">
      <button
        onClick={() =>
          actorRef.send({ type: isRunning ? "PAUSE" : "PLAY" })
        }
        disabled={state === "loading"}
        className="rounded bg-blue-600 px-3 py-1 text-sm font-medium transition-colors hover:bg-blue-500 disabled:opacity-50"
      >
        {isRunning ? "Pause" : "Play"}
      </button>

      <button
        onClick={() => actorRef.send({ type: "STEP" })}
        disabled={!isPaused}
        className="rounded bg-gray-600 px-3 py-1 text-sm transition-colors hover:bg-gray-500 disabled:opacity-50"
      >
        Step
      </button>

      <button
        onClick={() => actorRef.send({ type: "RESET" })}
        disabled={isIdle}
        className="rounded bg-gray-600 px-3 py-1 text-sm transition-colors hover:bg-gray-500 disabled:opacity-50"
      >
        Reset
      </button>

      <div className="mx-2 h-6 w-px bg-gray-600" />

      <label className="flex items-center gap-2 text-xs text-gray-300">
        Speed
        <select
          value={speed}
          onChange={(e) =>
            actorRef.send({
              type: "SET_SPEED",
              speed: Number(e.target.value),
            })
          }
          className="rounded bg-gray-700 px-2 py-1 text-xs"
        >
          <option value={0.1}>0.1x</option>
          <option value={1}>1x</option>
          <option value={10}>10x</option>
          <option value={100}>100x</option>
          <option value={1000}>1000x</option>
        </select>
      </label>

      <div className="mx-2 h-6 w-px bg-gray-600" />

      <span className="font-mono text-xs text-gray-400">
        T: {time.toFixed(2)}s
      </span>

      <span className="text-xs text-gray-500">{String(state)}</span>
    </div>
  );
}
