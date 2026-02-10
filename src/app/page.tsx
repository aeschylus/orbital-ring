"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { IntroProvider, IntroContext } from "@/providers/IntroProvider";
import { IntroOverlay } from "@/components/dom/intro/IntroOverlay";

const IntroCanvas = dynamic(
  () =>
    import("@/components/canvas/intro/IntroCanvas").then(
      (mod) => mod.IntroCanvas,
    ),
  { ssr: false, loading: () => <LoadingScreen /> },
);

function LoadingScreen() {
  return (
    <div className="flex h-full items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto" />
        <p className="text-gray-400">Preparing cinematic...</p>
      </div>
    </div>
  );
}

function IntroComplete() {
  const router = useRouter();
  const isComplete = IntroContext.useSelector(
    (state) => state.value === "complete",
  );

  useEffect(() => {
    if (isComplete) {
      router.push("/campaign");
    }
  }, [isComplete, router]);

  return null;
}

export default function IntroPage() {
  return (
    <IntroProvider>
      <div className="relative h-screen w-screen bg-black">
        <IntroCanvas />
        <IntroOverlay />
        <IntroComplete />
      </div>
    </IntroProvider>
  );
}
