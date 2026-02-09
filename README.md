# Orbital Ring Simulator

Simulation platform for orbital ring and tethered ring megastructure engineering. Combines orbital mechanics, wide-scale weather simulation, structural finite-element analysis, and origami-inspired deployment simulation in an interactive 3D web application.

## Concepts

This project models two related megastructure concepts:

**Tethered Ring** (Project Atlantis, Philip Swan) — A pipeline ring at 32 km altitude in the stratosphere, anchored to the seafloor via tethers and held aloft by spinning maglev rings and cable tension. Achievable with current materials (Kevlar, steel). Supports Mach 17 space launch, Mach 3 intercontinental transport, and habitation for 250,000 people.

**Orbital Ring** (Paul Birch, 1982) — A rotating ring at 300–600 km in LEO, spinning at 8–10 km/s. Stationary platforms couple electromagnetically to the rotor; "Jacob's Ladders" hang down to the surface. Potential launch cost of $0.05/kg.

## Stack

- **Next.js 15** — App Router, server components for landing/docs, client for simulation
- **React Three Fiber v9** — Declarative Three.js with drei utilities, postprocessing
- **XState v5** — Simulation state machine (play/pause/step/reset), parameter management
- **TypeScript** — Throughout

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 and click "Launch Simulation."

## Project Structure

```
src/
  app/
    simulation/        # Main simulation page (dynamic import, SSR disabled)
  components/
    canvas/            # 3D components (Earth, Ring, Tethers, SimulationCanvas)
    dom/               # 2D overlay controls (ControlPanel)
  machines/            # XState state machines
  providers/           # React context providers
  lib/
    constants/         # Physical constants (Earth, ISA, orbital/tethered ring params)
    physics/           # Physics computation (planned)
  workers/             # Web Workers for physics offloading (planned)
research/              # 9 research documents evaluating 100+ open source packages
```

## Phase Plan

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Bootstrap — scaffold, Earth, ring, tethers, XState controls | Done |
| 1 | Ring visualization — LOD, instancing, camera-relative rendering | |
| 2 | Basic physics — ISA model, centrifugal force, gravity | |
| 3 | Structural — Rapier.js tether dynamics, stress visualization | |
| 4 | Weather — ERA5/GFS preprocessing, stratospheric wind visualization | |
| 5 | Orbital mechanics — J2-J4 perturbation, atmospheric drag, precession | |
| 6 | Deployment — origami/unfolding simulation with Rapier hinge joints | |
| 7 | Advanced — multi-ring, transit systems, energy balance | |

## Key References

- [Project Atlantis](https://www.project-atlantis.com/) — Philip Swan's tethered ring concept and [Three.js simulation](https://github.com/philipswan/TetheredRing)
- Paul Birch (1982) — "Orbital Ring Systems and Jacob's Ladders," JBIS Vol. 35
- [NSS Orbital Rings paper](https://nss.org/wp-content/uploads/Orbital-Rings.pdf)

## Research

The `research/` directory contains detailed evaluations of open source packages across four simulation domains:

- **Orbital mechanics** — satellite.js, Rapier.js, Nyx Space, Orekit, poliastro
- **FEA / structural** — MFEM, CalculiX, OpenSees, Sparselizard, Verlet.js
- **Weather / atmospheric** — ERA5, GFS, NRLMSISE-00, ISA, CesiumJS
- **Origami / deployment** — Origami Simulator, FOLD format, Rapier hinge joints
