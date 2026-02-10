"use client";

import Link from "next/link";
import { IntroContext } from "@/providers/IntroProvider";

export function IntroControls() {
  const actorRef = IntroContext.useActorRef();
  const isPaused = IntroContext.useSelector(
    (state) => state.value === "paused",
  );
  const isPlaying = IntroContext.useSelector(
    (state) => state.value === "playing",
  );

  return (
    <div className="flex items-center gap-3">
      {/* Play/Pause */}
      {(isPlaying || isPaused) && (
        <button
          onClick={() => actorRef.send({ type: isPaused ? "PLAY" : "PAUSE" })}
          className="rounded-full bg-black/70 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:bg-black/90 hover:text-white border border-white/10"
        >
          {isPaused ? "Play" : "Pause"}
        </button>
      )}

      {/* Previous stage */}
      <button
        onClick={() => actorRef.send({ type: "PREV_STAGE" })}
        className="rounded-full bg-black/70 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:bg-black/90 hover:text-white border border-white/10"
      >
        Prev
      </button>

      {/* Next stage */}
      <button
        onClick={() => actorRef.send({ type: "SKIP_STAGE" })}
        className="rounded-full bg-black/70 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:bg-black/90 hover:text-white border border-white/10"
      >
        Next
      </button>

      {/* Skip intro */}
      <Link
        href="/campaign"
        className="rounded-full bg-black/70 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm transition-colors hover:bg-black/90 hover:text-white border border-white/10"
      >
        Skip Intro
      </Link>
    </div>
  );
}
