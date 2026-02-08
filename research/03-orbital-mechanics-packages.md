# Orbital Mechanics Simulation Packages -- Evaluation for Web-Based Orbital Ring Simulator

## Overview

This document evaluates open-source software packages for orbital mechanics simulation that could power a JavaScript/TypeScript web application simulating an orbital ring system. Our simulation requirements include:

- **Orbital ring dynamics**: Rotating ring at 300-600 km altitude, moving at 8-10 km/s
- **Precession control**: Counter-rotating ring elements for gyroscopic stabilization
- **Force modeling**: Gravitational forces (non-spherical Earth), centrifugal forces, atmospheric drag at low altitude
- **Tethered structures**: Stratospheric anchoring at ~32 km altitude, tether dynamics
- **Launch trajectories**: Transfer orbits from ring altitude to higher orbits (GEO, etc.)

The key challenge: no existing package was designed for orbital ring simulation specifically. We need to compose capabilities from multiple libraries or build custom physics on top of general-purpose engines.

---

## 1. JavaScript / TypeScript Libraries

### 1.1 satellite.js

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/shashwatak/satellite-js |
| **License** | MIT |
| **Language** | TypeScript |
| **Stars** | 1,023 |
| **Last Updated** | January 2026 |
| **NPM Downloads** | ~9,000/week |

**Capabilities**: SGP4/SDP4 satellite propagation from TLE (Two-Line Element) and OMM data. Coordinate transforms (ECI, ECF, geodetic, look angles). The internals are a direct port of Brandon Rhodes' Python sgp4 library.

**Suitability for orbital ring**: LOW. satellite.js is designed for tracking existing satellites via TLE data. It implements the SGP4 simplified perturbation model, which is appropriate for predicting the position of point-mass satellites, not for simulating the dynamics of a continuous rotating structure. It could be useful for validating orbital altitude/velocity relationships and for any secondary satellite interaction scenarios, but it cannot model ring dynamics, tether forces, or custom force models.

---

### 1.2 tle.js

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/davidcalhoun/tle.js |
| **License** | MIT |
| **Language** | JavaScript |
| **Stars** | 157 |
| **Last Updated** | February 2026 |

**Capabilities**: Higher-level wrapper around satellite.js providing a friendlier API for TLE parsing, satellite lat/lon, orbit line plotting, and look angle calculations.

**Suitability for orbital ring**: LOW. Same fundamental limitations as satellite.js -- TLE-based propagation only.

---

### 1.3 orbjs (orb by benelsen)

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/benelsen/orb / https://www.npmjs.com/package/orbjs |
| **License** | MIT |
| **Language** | JavaScript |
| **Stars** | 14 |
| **Last Updated** | 2016 (inactive) |

**Capabilities**: Coordinate system transformations, simple Keplerian orbit propagation, time conversions (JD, MJD, TAI, TT, UTC, GPS). Minimal dependencies.

**Suitability for orbital ring**: LOW-MEDIUM. The coordinate transforms and time handling could be useful as utility functions, but the library is unmaintained and limited in scope. No force modeling or numerical integration.

---

### 1.4 orb.js (by lizard-isana)

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/lizard-isana/orb.js |
| **License** | MIT |
| **Language** | JavaScript |
| **Stars** | 93 |
| **Last Updated** | February 2024 |

**Capabilities**: Astronomical calculations including planetary positions, lunar calculations, Keplerian orbital elements, and coordinate transforms. More astronomy-focused than astrodynamics-focused.

**Suitability for orbital ring**: LOW. Oriented toward astronomical observation rather than engineering simulation. No custom force models or numerical propagation.

---

### 1.5 kepler.js (jordanstephens)

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/jordanstephens/kepler.js |
| **License** | MIT |
| **Language** | JavaScript |
| **Stars** | 10 |
| **Last Updated** | 2018 (inactive) |

**Capabilities**: Two-body Keplerian orbit calculations. Converts between orbital elements and state vectors. Propagates orbits using Kepler's equation.

**Suitability for orbital ring**: LOW. Pure two-body Keplerian mechanics, no perturbations, no numerical integration, no custom forces. Too simplistic for our needs.

---

### 1.6 Keplerian-Core (KeplerianLab)

| Field | Detail |
|-------|--------|
| **URL** | https://www.npmjs.com/package/keplerian-core |
| **License** | MIT |
| **Language** | TypeScript |
| **Stars** | New project (published ~December 2025) |
| **Last Updated** | December 2025 |

**Capabilities**: Core numerical engine for KeplerianLab providing physics calculations for orbital mechanics simulation. Published in the Journal of Open Source Software. Version 0.1.1 available on npm.

**Suitability for orbital ring**: MEDIUM. Being TypeScript-native and recently published is attractive. However, as a very young library (v0.1.1), it likely lacks the breadth of force models and numerical integrators we need. Worth monitoring as it matures. The JOSS publication suggests scientific rigor.

---

### 1.7 jsOrrery

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/mgvez/jsorrery |
| **License** | MIT |
| **Language** | JavaScript |
| **Stars** | 423 |
| **Last Updated** | 2021 (inactive) |

**Capabilities**: WebGL Solar System simulator. Calculates planetary positions from orbital elements. Can switch to N-body gravity-based propagation. Uses Three.js for 3D rendering. Beautiful visualization with star fields (100k+ particles at 60fps).

**Suitability for orbital ring**: MEDIUM. The architecture -- combining orbital mechanics calculations with Three.js visualization -- is very close to what we need for our simulator's rendering layer. The N-body gravity mode demonstrates real-time gravitational simulation in the browser. However, it is designed for solar-system-scale simulation, not LEO engineering. No tether physics, no non-spherical gravity, no atmospheric drag. Best used as architectural inspiration rather than a direct dependency.

---

## 2. Physics Engines (JavaScript/WASM)

### 2.1 Rapier (dimforge)

| Field | Detail |
|-------|--------|
| **URL** | https://rapier.rs / https://github.com/dimforge/rapier.js |
| **License** | Apache-2.0 |
| **Language** | Rust (core), TypeScript (JS bindings) |
| **Stars** | 5,120 (core) / 628 (JS bindings) |
| **Last Updated** | January 2026 (core), November 2025 (JS) |
| **NPM** | @dimforge/rapier3d, @dimforge/rapier2d |

**Capabilities**: High-performance 2D and 3D rigid-body physics engine. Features include rigid bodies, colliders, joints/constraints (ball, revolute, prismatic, fixed), contact events, scene queries, continuous collision detection, and cross-platform determinism. WASM build is 2-5x faster than 2024 versions. Supports SIMD acceleration. Official Three.js integration exists (react-three-rapier).

**Suitability for orbital ring**: HIGH (for structural simulation). Rapier excels at rigid-body dynamics with constraints, making it strong for modeling tether mechanics, ring segment connections, and structural forces. Joint constraints can model tether attachment points. However, it does NOT include orbital mechanics (gravity is uniform, not gravitational inverse-square). We would need to:
1. Disable Rapier's default uniform gravity
2. Implement custom gravitational force application per-body each frame
3. Use Rapier's constraint solver for tether/structural connections
4. Layer orbital mechanics calculations on top

This hybrid approach -- Rapier for structural dynamics, custom code for orbital forces -- is likely the most practical architecture.

---

### 2.2 Ammo.js (Bullet Physics)

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/kripken/ammo.js |
| **License** | zlib (Bullet license) |
| **Language** | C++ compiled to JS/WASM via Emscripten |
| **Stars** | 4,481 |
| **Last Updated** | January 2024 |

**Capabilities**: Full port of the Bullet physics engine. Rigid body dynamics, soft body physics, constraints (point-to-point, hinge, slider, cone-twist), broadphase collision detection, and vehicle dynamics. Can build as both asm.js and WASM. Chains of rigid bodies can be connected using point-to-point constraints for tether-like behavior.

**Suitability for orbital ring**: MEDIUM-HIGH. Similar to Rapier in applicability -- excellent for structural/constraint physics but requires custom orbital mechanics layered on top. The point-to-point constraint system is directly applicable to tether modeling. Downsides vs. Rapier: larger bundle size (~1MB+ WASM), slower development pace, less modern API, no TypeScript-first design. The soft body physics could potentially model flexible tether behavior, which Rapier lacks.

---

### 2.3 Matter.js / Cannon.js

| Field | Detail |
|-------|--------|
| **URL** | https://brm.io/matter-js / https://github.com/schteppe/cannon.js |
| **License** | MIT |
| **Language** | JavaScript |

**Capabilities**: Matter.js is a 2D rigid body engine. Cannon.js is a 3D rigid body engine. Both support uniform gravity, constraints, and collision detection.

**Suitability for orbital ring**: LOW. Matter.js is 2D-only. Cannon.js is unmaintained (last updated 2020) and superseded by cannon-es. Neither has the performance characteristics needed for our simulation. Rapier is the clear modern choice in this category.

---

## 3. WASM-Compiled Orbital Mechanics

### 3.1 N-Body WASM Simulation (nbody-wasm-sim)

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/simbleau/nbody-wasm-sim |
| **License** | Unlicensed |
| **Language** | Rust compiled to WASM |
| **Stars** | 245 |
| **Last Updated** | 2022 |

**Capabilities**: 2D N-body gravitational simulation using Rust + WebGPU + WGSL shaders. Compiled to WASM. Demonstrates GPU-accelerated gravitational calculations in the browser.

**Suitability for orbital ring**: MEDIUM. Demonstrates the feasibility of running N-body gravitational simulations at scale in the browser via WASM. The architecture (Rust -> WASM + WebGPU for rendering) is relevant. However, it is a demo/benchmark, not a library. Would need significant adaptation.

---

### 3.2 High-Performance Gravity Simulation (simulatinggravity.com)

| Field | Detail |
|-------|--------|
| **URL** | https://simulatinggravity.com |
| **License** | Unknown |
| **Language** | Rust WASM + WebGL |

**Capabilities**: Barnes-Hut algorithm for efficient N-body simulation. WebGL particle rendering. Worker threads driving Rust WASM modules. Demonstrates efficient large-scale gravitational simulation in the browser.

**Suitability for orbital ring**: MEDIUM. The Barnes-Hut O(n log n) approach is relevant if we need to model many ring segments as individual particles. The architecture of Rust WASM workers + WebGL rendering is a proven pattern we could adopt. Not a reusable library, but a strong proof of concept.

---

### 3.3 orbital-mechanics-wasm

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/benmarch/orbital-mechanics-wasm |
| **License** | None specified |
| **Language** | JavaScript with WASM |
| **Stars** | 1 |
| **Last Updated** | 2018 |

**Capabilities**: Tool to generate restricted two-body orbits in WebAssembly. Very basic.

**Suitability for orbital ring**: VERY LOW. Minimal, abandoned, too simplistic.

---

## 4. C/C++ Libraries with WASM Potential

### 4.1 CSPICE / WebSPICE

| Field | Detail |
|-------|--------|
| **URL (CSPICE)** | https://naif.jpl.nasa.gov/naif/toolkit.html |
| **URL (WebSPICE)** | https://www.npmjs.com/package/webspice / https://gitlab.com/afeder/webspice |
| **URL (js-spice)** | https://www.npmjs.com/package/@gamergenic/js-spice |
| **URL (WASM port)** | https://github.com/arturania/cspice |
| **License** | NASA Open Source (CSPICE); various for wrappers |
| **Language** | C (compiled to WASM via Emscripten) |
| **Stars (WASM port)** | 33 |

**Capabilities**: NASA's SPICE toolkit provides observation geometry computations: reference frame transforms, time system conversions, ephemeris data for solar system bodies, coordinate system conversions, light-time corrections. WebSPICE compiles this to WASM for browser use. TimecraftJS (NASA-AMMOS) provides time conversion via CSPICE in JS. Note: each SPICE instance takes ~100MB of memory.

**Suitability for orbital ring**: MEDIUM. SPICE provides authoritative ephemeris data and coordinate transforms that would ensure our simulation uses accurate Earth parameters (shape, gravitational field direction, etc.). The 100MB memory footprint per instance is concerning for a web app. Best used selectively for high-precision reference frame management rather than as a core simulation engine.

---

### 4.2 GMAT (General Mission Analysis Tool)

| Field | Detail |
|-------|--------|
| **URL** | https://sourceforge.net/projects/gmat / https://opensource.gsfc.nasa.gov/projects/GMAT |
| **License** | NASA Open Source Agreement (NOSA) |
| **Language** | C++ |
| **Last Updated** | Active (R2022a latest stable) |

**Capabilities**: NASA's enterprise mission analysis tool. High-fidelity propagation with extensive force models (gravity harmonics, atmospheric drag, solar radiation pressure, third-body effects). Trajectory optimization with differential correctors and optimizers. MATLAB-like scripting language. GUI and batch modes. Used for real missions: LCROSS, LRO, OSIRIS-REx, TESS, MMS.

**Suitability for orbital ring**: HIGH (as a validation reference) / LOW (as a web component). GMAT is the gold standard for mission analysis but is a monolithic desktop application, not a library. Compiling to WASM would be an enormous undertaking. However, GMAT is invaluable as a **validation tool** -- we can run equivalent scenarios in GMAT to verify our web simulator produces correct results. Its force models (particularly J2-J6 gravity harmonics and atmospheric drag models) define the fidelity targets we should aim for.

---

### 4.3 Orekit

| Field | Detail |
|-------|--------|
| **URL** | https://www.orekit.org / https://github.com/CS-SI/Orekit |
| **License** | Apache-2.0 |
| **Language** | Java |
| **Stars** | 260 (GitHub mirror) |
| **Last Updated** | February 2026 (actively maintained) |

**Capabilities**: The most comprehensive open-source astrodynamics library. Features include:
- Multiple propagator types: analytical (Keplerian, Eckstein-Hechler), semi-analytical (DSST), numerical (configurable integrators)
- Force models: non-spherical gravity (any degree/order), atmospheric drag (DTM2000, Jacchia-Bowman 2006, Harris-Priester, exponential), solar radiation pressure, third-body attraction, solid/ocean tides
- Reference frame management with full IAU/IERS conventions
- Orbit determination (Kalman filter, batch least squares)
- Maneuver modeling
- Jacobian computation for sensitivity analysis

**Suitability for orbital ring**: HIGH (conceptually) / LOW (practically for web). Orekit has exactly the force models we need (non-spherical gravity, atmospheric drag at 300-600 km), but it is written in Java with no JavaScript/WASM path. A Python wrapper exists (via JNI/JPype), but that does not help for the browser. Orekit's **algorithms and force model implementations** should be studied and ported to TypeScript for our custom simulation engine. In particular:
- The J2-J6 gravitational perturbation code
- Atmospheric drag models for LEO
- Numerical integrator configurations for LEO propagation

---

## 5. Python Libraries (Reference / Pyodide Potential)

### 5.1 poliastro / hapsira

| Field | Detail |
|-------|--------|
| **URL (poliastro)** | https://github.com/poliastro/poliastro (ARCHIVED) |
| **URL (hapsira)** | https://github.com/pleiszenburg/hapsira |
| **License** | MIT |
| **Language** | Python |
| **Stars** | 976 (poliastro) / 40 (hapsira) |
| **Last Updated** | Oct 2023 (poliastro, archived) / May 2024 (hapsira) |

**Capabilities**: Pure Python astrodynamics library. Orbit propagation (analytical and numerical via scipy/numba). Lambert problem solver. Hohmann and bielliptic transfer calculations. Orbit plotting. Coordinate frame conversions via astropy. Uses numba JIT compilation for performance. Validated against GMAT and Orekit.

**Suitability for orbital ring**: MEDIUM (as reference). poliastro is archived; hapsira is the active fork but has low activity. The **pure Python** implementation means algorithms could potentially run via Pyodide (Python-in-WASM), though numba JIT is not compatible with Pyodide. More practically, the clean Python implementations of orbital mechanics algorithms (Lambert solver, Kepler equation solver, coordinate transforms) are excellent **reference implementations** to port to TypeScript.

---

### 5.2 Skyfield

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/skyfielders/python-skyfield |
| **License** | MIT |
| **Language** | Python |
| **Stars** | 1,664 |
| **Last Updated** | February 2026 (actively maintained) |

**Capabilities**: High-precision positional astronomy. SGP4 satellite propagation. Planetary ephemeris computation. Coordinate transforms. Pure Python with NumPy dependency only. Research-grade precision (0.0005 arcsecond agreement with USNO).

**Suitability for orbital ring**: LOW-MEDIUM. Skyfield is observation-oriented (where is object X at time T?) rather than dynamics-oriented (what forces act on object X?). Not suitable for simulating ring dynamics, but could be useful as a validation reference for position calculations.

---

### 5.3 Astropy

| Field | Detail |
|-------|--------|
| **URL** | https://www.astropy.org |
| **License** | BSD-3-Clause |
| **Language** | Python |
| **Stars** | ~4,500 |

**Capabilities**: Core astronomy library. Coordinate systems and transforms. Units and physical constants. Time systems. FITS file handling. Cosmological calculations.

**Suitability for orbital ring**: LOW (direct use) / MEDIUM (via Pyodide). Astropy's coordinate system and units handling is excellent but is a dependency, not a simulation engine. The galpy package (astropy-affiliated) has been demonstrated running in Pyodide, suggesting parts of astropy could work in-browser. However, the overhead of loading astropy via Pyodide (~50-100MB) is likely prohibitive for a responsive web app.

---

### 5.4 Pyodide (Meta-Tool)

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/pyodide/pyodide |
| **License** | MPL-2.0 |
| **Language** | Python / C (compiled to WASM) |
| **Stars** | 14,194 |
| **Last Updated** | February 2026 (very active) |

**Capabilities**: Full CPython runtime compiled to WASM. Includes NumPy, SciPy, Matplotlib, pandas, scikit-learn out of the box. Can install pure-Python packages from PyPI via micropip. JavaScript <-> Python foreign function interface.

**Suitability for orbital ring**: MEDIUM. Pyodide could enable running Python orbital mechanics code (poliastro/hapsira algorithms, custom scipy-based integrators) directly in the browser. Advantages: access to scipy's ODE solvers, NumPy's linear algebra. Disadvantages: large initial payload (~15-30MB), startup time (~2-5 seconds), numba JIT not supported, memory overhead. This could work as a **computation backend** running in a Web Worker, with a lightweight TypeScript/Three.js frontend. Not suitable for the real-time visualization loop, but viable for trajectory precomputation.

---

## 6. Rust Libraries with WASM Potential

### 6.1 Nyx Space

| Field | Detail |
|-------|--------|
| **URL** | https://github.com/nyx-space/nyx |
| **License** | AGPL-3.0 |
| **Language** | Rust |
| **Stars** | 410 |
| **Last Updated** | February 2026 (actively maintained) |

**Capabilities**: High-fidelity astrodynamics toolkit. Features include:
- Multiple Runge-Kutta integrators
- Non-spherical gravity fields
- Solar radiation pressure
- CCSDS tracking data ingestion
- Kalman filter orbit determination
- Monte Carlo constellation analysis
- SPICE kernel support
- Validated on real missions (CAPSTONE, Firefly Blue Ghost 1)

**Suitability for orbital ring**: HIGH (with WASM compilation). Nyx is the most promising candidate for a high-fidelity simulation core compiled to WASM. Being written in Rust, it has a natural compilation path to WASM via wasm-pack/wasm-bindgen. The AGPL-3.0 license requires careful consideration (copyleft implications for a web app). Key advantages:
- Mission-validated force models
- Rust -> WASM is a proven, well-supported path
- High performance with minimal memory allocation
- Includes the exact perturbation models we need (non-spherical gravity, atmospheric effects)

**Caveats**: No official WASM support yet. The library's dependencies (SPICE kernel loading, file I/O) would need adaptation for the browser environment. The AGPL license means any modifications must be released as open source.

---

## 7. Visualization Libraries (Complementary)

### 7.1 CesiumJS

| Field | Detail |
|-------|--------|
| **URL** | https://cesium.com/platform/cesiumjs |
| **License** | Apache-2.0 |
| **Language** | JavaScript |

**Capabilities**: 3D globe and map visualization. Time-dynamic simulation. Real-time telemetry streaming. 4D visualization. Used by AGI's ComSpOC for visualizing tens of thousands of satellites simultaneously. Sub-meter terrain rendering. Integrates well with satellite.js for orbit visualization.

**Suitability for orbital ring**: MEDIUM-HIGH (for visualization only). CesiumJS provides an excellent Earth rendering context for visualizing the orbital ring. The 3D globe with terrain, atmosphere rendering, and time-dynamic entity support would let us show the ring, tethers, and launch trajectories against a realistic Earth. However, CesiumJS is a rendering/visualization framework, not a physics engine. It would serve as an alternative to a pure Three.js approach for the visualization layer.

---

## 8. Recommended Architecture

Based on this evaluation, no single library meets all our needs. The recommended approach is a layered architecture:

### Layer 1: Custom Orbital Mechanics Engine (TypeScript)

Build a focused TypeScript library implementing:
- **Gravitational model**: J2-J4 spherical harmonics (ported from Orekit/poliastro reference implementations)
- **Atmospheric drag**: Exponential atmosphere model for 300-600 km (sufficient for initial simulation)
- **Numerical integration**: RK4 or RK7(8) Dormand-Prince integrator (port from Nyx or poliastro)
- **Orbital element conversions**: State vector <-> Keplerian elements
- **Ring-specific physics**: Centrifugal force on rotating segments, tension calculations, precession dynamics

Reference implementations to port from:
- **Orekit** (Java): Force model implementations, especially J2-J4 gravity and atmospheric drag
- **poliastro/hapsira** (Python): Clean, readable implementations of orbital mechanics fundamentals
- **Nyx** (Rust): High-performance integrator implementations

### Layer 2: Structural Physics (Rapier via WASM)

Use **Rapier** (@dimforge/rapier3d) for:
- Tether dynamics (chains of rigid bodies connected by joints)
- Ring segment connections and structural forces
- Collision detection between ring elements

Disable Rapier's default gravity and apply custom gravitational forces from Layer 1 to each body per timestep.

### Layer 3: Visualization (Three.js or CesiumJS)

- **Three.js**: More flexible, lighter weight, better for custom rendering of ring geometry
- **CesiumJS**: Better Earth context, time-dynamic entities, but heavier and more opinionated

Three.js is recommended for the primary simulator view, with CesiumJS as an optional "mission context" view.

### Layer 4: Validation / Precomputation (Optional)

- **GMAT**: Desktop tool for validating simulation results against NASA-grade propagation
- **Pyodide + SciPy**: Web Worker running Python for heavy precomputation (trajectory optimization, Monte Carlo analysis) that doesn't need real-time performance
- **Nyx via WASM**: If AGPL licensing is acceptable, compile Nyx to WASM for high-fidelity propagation as a future enhancement

---

## 9. Priority Packages for Immediate Use

| Priority | Package | Role | Effort |
|----------|---------|------|--------|
| 1 | **Rapier** (@dimforge/rapier3d) | Structural physics, tether dynamics | Low (npm install, well documented) |
| 2 | **Three.js** | 3D visualization and rendering | Low (standard choice) |
| 3 | **satellite.js** | Utility: coordinate transforms, orbit validation | Low (npm install) |
| 4 | **Orekit** (source reading) | Reference for force model implementations | Medium (study Java source, port to TS) |
| 5 | **poliastro/hapsira** (source reading) | Reference for integrators and orbital mechanics | Medium (study Python source, port to TS) |
| 6 | **GMAT** (desktop) | Validation of simulation results | Low (download and run comparison scenarios) |
| 7 | **Nyx** (Rust -> WASM) | Future high-fidelity propagation backend | High (WASM compilation, API binding) |
| 8 | **CesiumJS** | Optional Earth-context visualization | Medium (integration with simulation state) |

---

## 10. Key Algorithms to Implement

Based on the evaluation, these algorithms from the surveyed libraries should be implemented in TypeScript for our orbital ring simulator:

1. **J2-J4 gravitational perturbation** (from Orekit): Non-spherical Earth gravity, critical for LEO ring stability analysis
2. **Exponential atmosphere model** (from Orekit): Drag at 300-600 km, important for ring energy balance
3. **RK4/Dormand-Prince integrator** (from Nyx/poliastro): Numerical integration of equations of motion
4. **Kepler equation solver** (from poliastro): Fast conversion between orbital elements and time
5. **Lambert problem solver** (from poliastro): Launch trajectory planning from ring to target orbit
6. **Centrifugal force on rotating ring segments**: Custom implementation based on orbital ring physics papers
7. **Tether tension model**: Custom implementation combining gravitational gradient and centrifugal effects
8. **Precession dynamics**: Gyroscopic effects of counter-rotating ring elements

---

## Sources

- [satellite.js](https://github.com/shashwatak/satellite-js)
- [tle.js](https://github.com/davidcalhoun/tle.js)
- [orbjs](https://www.npmjs.com/package/orbjs)
- [orb.js](https://github.com/lizard-isana/orb.js)
- [kepler.js (jordanstephens)](https://github.com/jordanstephens/kepler.js)
- [kepler.js (Rotiahn)](https://github.com/Rotiahn/kepler.js)
- [Keplerian-Core JOSS paper](https://joss.theoj.org/papers/da0865fe1f5a59f12bf9f2b14b7130ca)
- [jsOrrery](https://github.com/mgvez/jsorrery)
- [Rapier physics engine](https://rapier.rs/)
- [Rapier.js](https://github.com/dimforge/rapier.js)
- [Rapier 2025 review](https://dimforge.com/blog/2026/01/09/the-year-2025-in-dimforge/)
- [Ammo.js (Bullet)](https://github.com/kripken/ammo.js)
- [Matter.js](https://brm.io/matter-js/)
- [Cannon.js](https://github.com/schteppe/cannon.js)
- [nbody-wasm-sim](https://github.com/simbleau/nbody-wasm-sim)
- [High-Performance Gravity Simulation](https://simulatinggravity.com/)
- [Barnes-Hut JS implementation](https://github.com/Elucidation/Barnes-Hut-Tree-N-body-Implementation-in-HTML-Js)
- [CSPICE toolkit](https://naif.jpl.nasa.gov/naif/toolkit.html)
- [WebSPICE](https://www.npmjs.com/package/webspice)
- [CSPICE WASM port](https://github.com/arturania/cspice)
- [js-spice](https://www.npmjs.com/package/@gamergenic/js-spice)
- [TimecraftJS (NASA-AMMOS)](https://github.com/NASA-AMMOS/timecraftjs)
- [GMAT (NASA)](https://opensource.gsfc.nasa.gov/projects/GMAT)
- [Orekit](https://www.orekit.org/)
- [Orekit GitHub](https://github.com/CS-SI/Orekit)
- [Orekit Python Wrapper](https://gitlab.orekit.org/orekit-labs/python-wrapper)
- [poliastro](https://github.com/poliastro/poliastro) (archived)
- [hapsira](https://github.com/pleiszenburg/hapsira)
- [Skyfield](https://github.com/skyfielders/python-skyfield)
- [Astropy](https://www.astropy.org/)
- [Pyodide](https://github.com/pyodide/pyodide)
- [Nyx Space](https://github.com/nyx-space/nyx)
- [CesiumJS](https://cesium.com/platform/cesiumjs/)
- [Orbital ring stability paper (Rippert 2014)](https://arxiv.org/pdf/1412.1881)
- [Orbital ring Wikipedia](https://en.wikipedia.org/wiki/Orbital_ring)
- [Space Elevator Simulation (ISEC)](https://www.isec.org/2017-study)
- [NASA 42 Simulator](https://software.nasa.gov/software/GSC-16720-1)
- [Copernicus (NASA)](https://software.nasa.gov/software/MSC-26673-1)
- [awesome-space](https://github.com/orbitalindex/awesome-space)
