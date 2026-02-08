import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold tracking-tight">
        Orbital Ring Simulator
      </h1>
      <p className="max-w-lg text-center text-lg text-gray-400">
        Engineering simulation platform for orbital ring and tethered ring
        megastructures. Combines orbital mechanics, atmospheric modeling,
        structural analysis, and deployment simulation.
      </p>
      <Link
        href="/simulation"
        className="rounded-lg bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-500"
      >
        Launch Simulation
      </Link>
    </main>
  );
}
