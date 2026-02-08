# Research Synthesis — Orbital Ring Simulation Platform

## The Problem Domain

Two related megastructure concepts require simulation:

### 1. Tethered Ring (Project Atlantis — Philip Swan)
- Pipeline ring at **32 km altitude** (stratosphere), 32,000 km circumference
- Anchored to seafloor via tethers, held up by spinning maglev ring + cable tension
- Achievable with **current technology** (Kevlar, steel, existing maglev)
- Supports space launch (Mach 17 / 5,800 m/s), transport (Mach 3), habitation (250K people)
- Constructed by ocean extrusion → submersion testing → spin-up → rise to altitude

### 2. Classic Orbital Ring (Paul Birch, 1982)
- Rotating ring at **300-600 km** (LEO), 8-10 km/s rotor velocity
- Stationary platforms coupled electromagnetically; "Jacob's Ladders" hang down
- Requires more exotic materials; $0.05/kg launch cost potential
- Counter-rotating elements for zero net angular momentum

## Engineering Simulation Domains

| Domain | Tethered Ring (32km) | Orbital Ring (LEO) |
|--------|---------------------|-------------------|
| **Orbital Mechanics** | Sub-orbital centrifugal force | Full orbital dynamics, precession |
| **Weather/Atmosphere** | CRITICAL: jet streams, polar vortex, QBO | Atmospheric drag at LEO |
| **Structural/FEA** | Tether catenary, ring stress, maglev track | Cable tension, stress distribution |
| **Deployment** | Ocean → altitude deployment | Bootstrap construction sequence |

## Recommended Technology Stack

### Core Application
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **Next.js 15** (App Router) | Server components for landing/docs, client for sim |
| State | **XState v5** | Simulation control (play/pause/step), UI workflows, parameter management |
| 3D Rendering | **React Three Fiber v9** + drei + postprocessing | Declarative Three.js, LOD, instancing, atmosphere shaders |
| UI Controls | **Leva** | Parameter tuning panels, hot-swappable for production UI |
| Perf Monitor | **r3f-perf** | FPS, GPU, draw calls, triangles |

### Physics/Simulation
| Subsystem | Choice | Rationale |
|-----------|--------|-----------|
| Structural physics | **Rapier.js** (@dimforge/rapier3d) | WASM rigid-body + joints for tethers; Apache 2.0 |
| Orbital mechanics | **Custom TypeScript** (ported from Orekit/poliastro) | J2-J4 gravity, exponential atmosphere, RK4/Dormand-Prince integrator |
| Atmospheric model | **ISA (TypeScript)** + **NRLMSISE-00 (WASM)** | Density profiles for both 32km and 300-600km |
| Weather data | **ERA5/GFS** via Python preprocessing | Stratospheric winds, pre-processed to JSON |
| Origami/deployment | **Rapier.js** (hinge joints) + **FOLD format** | Rigid panel deployment simulation |
| Cable visualization | **Verlet integration** (TypeScript) | Real-time catenary shapes |

### Data Sources
| Data | Source | Format |
|------|--------|--------|
| Stratospheric winds | ERA5 (ECMWF) / GFS (NOAA) | Pre-processed JSON via Python (MetPy + xarray) |
| Atmospheric density (stratosphere) | ISA / US Standard Atmosphere 1976 | Direct TypeScript implementation |
| Atmospheric density (LEO) | NRLMSISE-00 | C → WASM compilation |
| Earth textures | NASA Blue Marble / Natural Earth | PNG textures |
| Geographic ring path | KML data (ref: Project Atlantis) | GeoJSON |

### Key Architectural Decisions
1. **Camera-relative rendering** + logarithmic depth buffer for Earth-scale scenes
2. **Two-loop architecture**: physics at fixed timestep (120Hz+), rendering at 60fps
3. **Web Worker** for physics computation (Rapier + custom forces)
4. **LOD strategy**: 5 levels from shader-line (>10,000 km) to full structural detail (<10 km)
5. **Instanced rendering** for repeating ring elements (tethers, segments, stations)
6. Start **WebGL**, design shaders with **TSL** for future WebGPU migration

## Phased Implementation Plan

### Phase 0: Project Bootstrap
- Create GitHub repo (aeschylus/orbital-ring)
- Next.js 15 + TypeScript + React Three Fiber v9 + XState v5
- Basic Earth sphere with atmosphere shader
- OrbitControls, basic camera setup
- XState simulation machine (play/pause/step/reset)

### Phase 1: Ring Visualization
- Render ring at configurable altitude (32km / 300-600km toggle)
- Tether lines from ring to surface (instanced)
- LOD system (5 levels)
- Parameter panel (Leva): altitude, ring mass, tether count, spin rate
- Camera-relative rendering for precision at Earth scale

### Phase 2: Basic Physics
- ISA atmospheric model (TypeScript)
- Centrifugal force calculation for spinning ring
- Gravitational model (point mass initially → J2 perturbation)
- Tether tension computation (static equilibrium)
- Force vector visualization overlay

### Phase 3: Structural Simulation
- Rapier.js integration for tether dynamics
- Cable catenary shapes under gravity + wind
- Ring segmentation with hinge joints
- Stress/strain visualization (color mapping)
- Material property database (Kevlar, CNT, steel)

### Phase 4: Weather Integration
- ISA vertical profiles along ring path
- ERA5/GFS data preprocessing pipeline
- Stratospheric wind visualization (particle advection)
- Wind loading on tethers
- "Live weather" mode vs "design conditions" mode

### Phase 5: Orbital Mechanics
- Full orbital dynamics for LEO ring mode
- J2-J4 gravitational perturbation
- Atmospheric drag at LEO (NRLMSISE-00 via WASM)
- Precession control simulation
- Launch trajectory visualization (ring → orbit)

### Phase 6: Deployment Simulation
- Origami/unfolding simulation using Rapier hinge joints
- Construction sequence animation (ocean → altitude)
- FOLD format import for deployment patterns
- Progressive loading visualization

### Phase 7: Advanced Features
- Multi-ring configurations (4-ring Atlantis design)
- Transit system simulation (Mach 3/17 vehicles)
- Energy balance computation (drag power vs. solar input)
- Comparative analysis tools (parameter sweeps)
- FEA backend integration (OpenSees/MFEM for detailed analysis)

## Key References
- Project Atlantis Three.js simulation: https://www.project-atlantis.com/wp-content/threejs-simulation/TetheredRing/
- Project Atlantis TetheredRing repo: https://github.com/philipswan/TetheredRing
- Paul Birch (1982) JBIS "Orbital Ring Systems and Jacob's Ladders"
- Philip Swan "A Brief Explanation of the Tethered Ring"
- NSS "Orbital Rings" paper
