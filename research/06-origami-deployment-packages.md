# Origami and Deployable Structure Simulation Packages

## Research Purpose

The orbital ring structure needs to deploy from a compact construction state (assembled in the ocean) to its full deployed state at 32 km altitude. Additionally, orbital ring habitats may use deployable and inflatable structures similar to those used in space applications (e.g., NASA's BEAM module, Bigelow Aerospace expandable habitats). This document evaluates open-source software packages for simulating origami-inspired folding, deployment kinematics, and structural transformation that could be integrated into a JavaScript/TypeScript web application.

---

## 1. JavaScript/TypeScript Origami Libraries

### 1.1 Origami Simulator (Amanda Ghassaei)

- **URL:** https://github.com/amandaghassaei/OrigamiSimulator
- **Live Demo:** https://origamisimulator.org/
- **License:** MIT
- **Language:** JavaScript (WebGL/GPU shaders)
- **npm:** `origami-simulator` (v1.0.0 on npm, but the GitHub repo is the primary source)

**Key Capabilities:**
- Real-time GPU-accelerated origami folding simulation using WebGL fragment shaders
- Simulates how any crease pattern folds by iteratively solving for small displacements due to crease forces
- Supports both SVG and FOLD format input for crease patterns
- Uses a "truss model" where the sheet is modeled as a mesh of nodes connected by edges (bars) with angular constraints at creases
- All simulation runs in parallel on the GPU for fast, interactive performance
- Built on Three.js for rendering and 3D interaction
- Uses gpu-io (also by Ghassaei) as the underlying GPU computation library
- Supports mountain/valley fold assignments, target fold angles, and stiffness parameters
- Visualizes strain, fold angles, and displacement during simulation

**Dependencies:**
- Three.js (rendering and 3D interaction)
- gpu-io (GPU-accelerated computing, also MIT licensed)
- FOLD library (internal data structure)
- Earcut (triangulation of polygonal faces)
- svgpath / path-data-polyfill (SVG parsing)

**Suitability for Ring Deployment:**
This is the single most relevant package for the project. It directly simulates the physics of unfolding from a compact state to a deployed state, runs entirely in the browser with GPU acceleration, and is MIT licensed. The truss-model approach could be adapted to simulate ring segment deployment. The main limitation is that it is designed for paper-like sheet origami rather than thick-panel engineering structures, but the underlying physics engine could be extended or its approach replicated for structural panels.

**Rating: HIGH** -- Primary candidate for integration or adaptation.

---

### 1.2 Rabbit Ear

- **URL:** https://github.com/rabbit-ear/rabbit-ear
- **Website:** https://rabbitear.org/
- **npm:** `rabbit-ear` (v0.9.4)
- **License:** MIT
- **Language:** JavaScript (ES6 modules)

**Key Capabilities:**
- Computational origami library for encoding, modifying, and rendering origami models
- Uses FOLD format as the primary data structure
- Math library for origami geometry (Huzita-Justin axioms, Kawasaki's theorem, Maekawa's theorem)
- Flat-foldability analysis (checks if a crease pattern can fold flat)
- FOLD graph manipulation (add/remove vertices, edges, faces; split edges; merge vertices)
- SVG rendering library for 2D crease pattern visualization
- WebGL rendering for 3D folded state visualization
- Available as UMD, ES6 module, and minified builds

**Suitability for Ring Deployment:**
Rabbit Ear is more of a design and analysis tool than a physics simulator. It excels at crease pattern manipulation, flat-foldability checks, and rendering but does not include dynamic simulation of the folding process. It would be useful as a complementary library for generating and manipulating crease pattern data in FOLD format, which could then be fed to a physics simulator like Origami Simulator. Its math utilities for origami geometry could be valuable for computing fold angles, sector angles, and other geometric properties of deployable ring segments.

**Rating: MEDIUM** -- Useful as a support library for crease pattern generation and FOLD data manipulation.

---

### 1.3 FOLD (Flexible Origami List Datastructure)

- **URL:** https://github.com/edemaine/fold
- **Website:** https://edemaine.github.io/fold/
- **npm:** `fold`
- **License:** MIT
- **Language:** JavaScript

**Key Capabilities:**
- Standard file format (`.fold`) for describing origami models: crease patterns, mountain-valley assignments, folded states, face overlaps
- JSON-based format, making it trivially parseable in any language
- Stores mesh data: vertices, edges, faces with 2D/3D geometry and topological stacking order
- JavaScript library providing utilities for:
  - Converting between representations
  - Filtering and transforming FOLD objects
  - Collapsing nearby vertices
  - Subdividing edges
- Command-line tool `fold-convert` for format conversion
- Specification maintained by Erik Demaine (MIT CSAIL)

**Suitability for Ring Deployment:**
FOLD is the de facto standard data format in the computational origami community. Any origami simulation pipeline should use FOLD as the interchange format. The library itself is lightweight and focused on data manipulation rather than simulation. It would serve as the data layer connecting crease pattern generators, simulators, and renderers.

**Rating: MEDIUM-HIGH** -- Essential data format and utility library for any origami simulation pipeline.

---

### 1.4 gpu-io

- **URL:** https://github.com/amandaghassaei/gpu-io
- **Website:** https://apps.amandaghassaei.com/gpu-io/
- **npm:** `gpu-io`
- **License:** MIT
- **Language:** TypeScript/JavaScript

**Key Capabilities:**
- GPU-accelerated computing library for web browsers
- Manages WebGL state, shader/program caching, and version compatibility
- Supports WebGL 2.0 with fallback to WebGL 1.0
- Used for physics simulations, particle/agent-based simulations, cellular automata, image processing
- Minimal dependencies (type-checks, float16 polyfill)
- Created as the computational backbone for Origami Simulator

**Suitability for Ring Deployment:**
If building a custom deployment simulation from scratch rather than adapting Origami Simulator directly, gpu-io provides the GPU computation layer. It handles the low-level WebGL complexity and lets you focus on writing simulation shaders. This would be the path for implementing a more engineering-oriented deployment simulation that goes beyond paper origami physics.

**Rating: HIGH** -- Key infrastructure for GPU-accelerated custom simulation.

---

### 1.5 Miura-Ori Generator (mwalczyk)

- **URL:** https://github.com/mwalczyk/miura-ori
- **Website:** https://michaelwalczyk.com/project-miura-ori.html
- **License:** Not specified (check repo)
- **Language:** JavaScript (web-based canvas tool)

**Key Capabilities:**
- Generates semigeneralized Miura-ori crease patterns from user-defined cross-sections
- Users draw a polyline on canvas; the tool generates the corresponding Miura-ori pattern
- Exports to FOLD format for use with other origami simulators
- Interactive web-based interface

**Suitability for Ring Deployment:**
Miura-ori is one of the most studied deployable origami patterns, originally invented by astrophysicist Koryo Miura for deployable solar arrays (used on the Japanese Space Flyer Unit satellite in 1995). It has a single-degree-of-freedom deployment mechanism, meaning the entire structure can be deployed with one actuator. This pattern is directly relevant to ring segment deployment where panels need to unfold from a compact stacked state to a flat deployed state. The generator could produce crease patterns for ring panel segments.

**Rating: MEDIUM** -- Useful for generating specific deployment patterns relevant to ring panel design.

---

### 1.6 Origamizake (georgiee/origami)

- **URL:** https://github.com/georgiee/origami
- **Live Demo:** https://georgiee.github.io/origami/
- **License:** Not specified (check repo)
- **Language:** JavaScript + Three.js

**Key Capabilities:**
- Origami model rendered and animated in Three.js
- Step-by-step folding animation from flat paper to completed model
- Audio-reactive visualization mode
- Demonstrates procedural origami folding animation in the browser

**Suitability for Ring Deployment:**
More of an art/demonstration project than an engineering tool. However, it demonstrates that step-by-step fold animation with Three.js is achievable and could serve as a reference for implementing deployment sequence animations. The animation approach of sequentially applying folds could be adapted for showing ring segment deployment sequences.

**Rating: LOW** -- Reference for animation approach only.

---

### 1.7 OriDomi

- **URL:** http://oridomi.com/
- **License:** MIT
- **Language:** JavaScript (DOM/CSS3)

**Key Capabilities:**
- CSS3-based origami folding effects for DOM elements
- Purely visual/CSS transforms, no physics simulation
- Accordion, curl, and fold effects

**Suitability for Ring Deployment:**
Not suitable for engineering simulation; this is a UI animation library. Mentioned for completeness.

**Rating: NONE** -- Not applicable.

---

## 2. Computational Origami Tools and Formats

### 2.1 Tomohiro Tachi's Software Suite

- **URL:** https://origami.c.u-tokyo.ac.jp/~tachi/software/
- **License:** Proprietary (free for non-commercial use with attribution; contact for commercial)
- **Language:** Native desktop applications (Windows/Mac)
- **NOT web-compatible**

**Three tools:**

**Rigid Origami Simulator:**
- Simulates rigidly foldable origami mechanisms
- Treats panels as rigid bodies connected by hinges
- Allows 3D manipulation and analysis of fold kinematics
- Computes fold angles, identifies locked configurations
- The foundational academic tool for rigid origami simulation

**Freeform Origami:**
- Interactive design tool for exploring rigidly foldable origami forms
- Grab and pull vertices to deform the 3D shape; crease pattern updates in real time
- Useful for determining rigid foldability of existing patterns
- Enables exploration of the design space of deployable mechanisms

**Origamizer:**
- Constructs crease patterns that fold into arbitrary user-specified 3D surfaces
- Given a target 3D shape, computes the flat crease pattern needed to fold it
- Based on "tucking molecule" approach

**Suitability for Ring Deployment:**
These are the gold standard for rigid origami research but are proprietary desktop applications, not web-compatible. They cannot be directly integrated into a JavaScript application. However, Tachi's published algorithms (particularly for rigid origami simulation) are well-documented in academic papers and can be re-implemented. Amanda Ghassaei's Origami Simulator is heavily inspired by this work. The key algorithmic contribution -- modeling origami as a system of rigid panels with rotational springs at fold lines -- is the foundation for most origami simulation.

**Rating: HIGH (as algorithmic reference) / NONE (for direct integration)**

---

### 2.2 TreeMaker (Robert J. Lang)

- **URL:** https://langorigami.com/article/treemaker/
- **GitHub (fork):** https://github.com/wesen/TreeMaker
- **License:** Open source (GPL)
- **Language:** C++

**Key Capabilities:**
- Computes crease patterns from stick-figure (tree graph) descriptions
- Given a tree diagram specifying flap count, lengths, and connectivity, generates the optimal crease pattern
- Uses numerical optimization (CFSQP) to find crease patterns for origami bases
- Foundational tool in computational origami design

**Suitability for Ring Deployment:**
TreeMaker is designed for artistic origami base design, not structural deployment simulation. Its approach of computing crease patterns from topological descriptions is not directly applicable to simulating ring deployment. However, the concept of algorithmic crease pattern generation from high-level structural descriptions could inspire approaches to generating deployment patterns for ring segments.

**Rating: LOW** -- Conceptually interesting but not practically applicable.

---

### 2.3 Crease Pattern Editor (Erik Demaine)

- **URL:** https://github.com/edemaine/cp-editor
- **License:** MIT
- **Language:** JavaScript (web-based)

**Key Capabilities:**
- Web-based interactive crease pattern editor
- Draw and modify crease patterns with mountain/valley assignments
- Export to FOLD format
- Part of the broader computational origami ecosystem at MIT

**Suitability for Ring Deployment:**
A useful design tool for creating crease patterns that could then be simulated. Would be valuable in a workflow where ring segment deployment patterns are designed interactively and then tested in simulation.

**Rating: LOW-MEDIUM** -- Design tool, not simulation.

---

### 2.4 CP Studio (robbykraft)

- **URL:** https://github.com/robbykraft/cp-studio
- **License:** Not specified (check repo)
- **Language:** JavaScript

**Key Capabilities:**
- Origami crease pattern editor with built-in origami simulator integration
- 2D vector canvas for drawing crease lines
- Folded state rendering
- Uses Rabbit Ear library internally

**Suitability for Ring Deployment:**
Another design tool that bridges pattern editing and simulation. Could serve as a reference for building an integrated design-and-simulate interface for ring deployment patterns.

**Rating: LOW** -- Reference implementation for UI workflow.

---

## 3. Deployable Structures Simulation Tools

### 3.1 SWOMPS (Sequentially Working Origami Multi-Physics Simulator)

- **URL:** https://github.com/zzhuyii/OrigamiSimulator
- **Institution:** University of Michigan, Deployable and Reconfigurable Structures Laboratory
- **License:** Check repository (academic)
- **Language:** MATLAB

**Key Capabilities:**
- Multi-physics simulation of active origami systems
- Bar-and-hinge model: reduced-order simulation where origami panels are modeled as bars (for in-plane stiffness) and hinges (for fold rotation)
- Captures large deformation folding
- Heat transfer simulation (for thermally-actuated origami)
- Inter-panel contact detection and response
- Thermal-mechanically coupled actuation
- Sequential analysis: apply different loads/conditions in arbitrary order
- Thick-panel simulation with separate panel and connector stiffnesses
- Published in IDETC-CIE 2021

**Suitability for Ring Deployment:**
SWOMPS is arguably the most engineering-relevant origami simulation tool. Its bar-and-hinge model captures both kinematics and structural mechanics of thick-panel origami, which is exactly what ring deployment requires. The multi-physics capabilities (thermal actuation, contact) are relevant for simulating deployment mechanisms. The main barrier is that it is MATLAB-only. To use it in a web application, one would need to either: (a) reimplement the bar-and-hinge formulation in JavaScript/TypeScript, (b) compile MATLAB to WebAssembly using MATLAB Coder (commercial license required), or (c) use it as an offline analysis tool and import results. The bar-and-hinge formulation itself is well-documented in academic papers and could be reimplemented.

**Rating: HIGH (as algorithmic reference) / LOW (for direct web integration)**

---

### 3.2 MERLIN / MERLIN2

- **URL:** https://paulino.princeton.edu/software.html
- **Papers:** Semantic Scholar (Liu & Paulino)
- **License:** Academic (check with authors)
- **Language:** MATLAB

**Key Capabilities:**
- Nonlinear structural analysis of origami assemblages
- Bar-and-hinge model with fully nonlinear displacement-based formulation
- Quasi-static finite element analysis
- Captures highly nonlinear behavior including snap-through, bistability
- MERLIN2 extends with polygonal panel support (not just triangulated)
- MERLIN2.LUX variant for light-activated shape memory polymer simulation
- Efficient nonlinear solver for large origami structures

**Suitability for Ring Deployment:**
MERLIN is focused on structural analysis (stress, strain, stability) rather than kinematic deployment simulation. It could analyze whether a proposed deployment configuration is structurally sound, whether snap-through instabilities exist, and what forces are required for deployment. Like SWOMPS, it is MATLAB-only. The nonlinear formulation is more rigorous than Origami Simulator's truss model and could produce more accurate structural predictions. Its approach to analyzing bistability is relevant for ring segments that need to lock into a deployed configuration.

**Rating: MEDIUM-HIGH (as structural analysis reference) / LOW (for direct web integration)**

---

### 3.3 Sim-FAST (Simulator For Active Structures)

- **URL:** https://github.com/zzhuyii/Sim-FAST
- **Institution:** University of Michigan
- **License:** Check repository
- **Language:** MATLAB (requires R2024a+)

**Key Capabilities:**
- Generalized version of SWOMPS for all kinds of active structures (not just origami)
- Supports tensegrity, origami, trusses, mechanisms, metamaterials
- Bar-and-hinge model with four-node and three-node rotational spring elements
- Large deformation kinematics and load-carrying analysis
- No rotational degrees of freedom (nodal representation only)
- Bending and twisting through rotational spring elements

**Suitability for Ring Deployment:**
The generalization beyond origami to tensegrity and truss structures is highly relevant, since an orbital ring combines multiple structural paradigms. However, MATLAB-only.

**Rating: MEDIUM (as reference) / LOW (for direct web integration)**

---

### 3.4 Crane (Grasshopper Plugin)

- **URL:** https://www.food4rhino.com/en/app/crane
- **License:** Check with authors
- **Language:** C# (Grasshopper/Rhino plugin)

**Key Capabilities:**
- Integrated computational design platform for origami products
- 2D and 3D crease pattern design
- Rigid folding simulation
- Form-finding (inverse: given constraints, find a crease pattern)
- Panel thickening (converts zero-thickness crease patterns to thick 3D volumes with hinges)
- Built-in pattern generators (Miura-ori, Yoshimura, waterbomb, chicken-wire)
- Integration with Rhino/Grasshopper CAD ecosystem

**Suitability for Ring Deployment:**
Crane's panel thickening capability is uniquely relevant since real ring structures have thickness. Its form-finding approach (inverse design) could help determine what crease patterns achieve desired deployed shapes. However, it is a Rhino/Grasshopper plugin and not web-compatible. Could be used as an offline design tool in the engineering pipeline.

**Rating: MEDIUM (for offline design) / NONE (for web integration)**

---

## 4. Physics Engines for Folding/Unfolding

### 4.1 Rapier (dimforge)

- **URL:** https://rapier.rs/
- **GitHub:** https://github.com/dimforge/rapier.js
- **npm:** `@dimforge/rapier3d`
- **License:** Apache 2.0
- **Language:** Rust compiled to WebAssembly, with JavaScript bindings

**Key Capabilities:**
- Full rigid body dynamics (3D and 2D)
- Joint/constraint system: revolute joints (hinges), prismatic joints, ball joints, fixed joints
- Contact detection and response with friction and restitution
- Force-based joint motors (set target positions, velocities, or forces)
- Cross-platform determinism
- Excellent performance via WASM
- Active development and strong Three.js integration (react-three-rapier)

**Suitability for Ring Deployment:**
Rapier is the strongest candidate for a general-purpose physics engine to drive deployment simulation. Its revolute joint system can model fold hinges between rigid panels, and joint motors can drive deployment. You could model ring segments as rigid bodies connected by hinge constraints and simulate the deployment sequence by driving joint motors to target fold angles. This would give physically realistic deployment dynamics including inertia, contact, and constraint forces. The WASM-based performance is suitable for real-time interactive simulation. The main limitation is that it models rigid bodies only (no panel bending/flexing), but this is appropriate for thick-panel origami where panels are assumed rigid.

**Rating: HIGH** -- Best general-purpose physics engine for rigid panel deployment simulation.

---

### 4.2 Cannon-es (pmndrs fork of Cannon.js)

- **URL:** https://pmndrs.github.io/cannon-es/docs/
- **npm:** `cannon-es`
- **License:** MIT
- **Language:** JavaScript (pure JS, no WASM)

**Key Capabilities:**
- 3D rigid body physics with collision detection
- Constraint system including hinge/revolute constraints, point-to-point, lock, distance
- Springs with configurable stiffness and damping
- Simpler API than Rapier but lower performance
- Good Three.js integration

**Suitability for Ring Deployment:**
A viable alternative to Rapier for simpler deployment simulations. The hinge constraint can model fold lines between panels. Being pure JavaScript (no WASM), it is simpler to integrate but slower for large simulations. Suitable for visualizing deployment of moderate-complexity structures (tens to hundreds of panels).

**Rating: MEDIUM** -- Simpler alternative to Rapier for smaller simulations.

---

### 4.3 Ammo.js

- **URL:** https://github.com/kripken/ammo.js
- **License:** zlib (Bullet Physics license)
- **Language:** C++ (Bullet Physics) compiled to JavaScript/WASM via Emscripten

**Key Capabilities:**
- Port of Bullet Physics to JavaScript/WebAssembly
- Full rigid body dynamics
- Soft body dynamics (deformable meshes, cloth)
- Extensive constraint types
- Mature, battle-tested physics engine

**Suitability for Ring Deployment:**
Ammo.js is the most feature-rich JavaScript physics engine, including soft body simulation that could model flexible panels and membranes. However, the API is verbose and closely mirrors the C++ Bullet API, making it harder to work with than Rapier. The soft body capabilities could be valuable for simulating inflatable/membrane structures, but the developer experience is significantly worse than Rapier.

**Rating: MEDIUM** -- Consider for soft body/membrane simulation specifically.

---

### 4.4 Matter.js / p2.js (2D Engines)

- **Matter.js URL:** https://github.com/liabru/matter-js (MIT license)
- **p2.js URL:** https://github.com/schteppe/p2.js (MIT license)
- **Language:** JavaScript

**Key Capabilities:**
- 2D rigid body physics
- Constraint/joint systems (revolute, distance, spring)
- Fast for 2D simulations

**Suitability for Ring Deployment:**
Could be useful for 2D cross-section views of deployment (e.g., showing a ring segment unfolding in profile view), but not suitable for full 3D deployment simulation. Useful for prototyping deployment kinematics in 2D before implementing in 3D.

**Rating: LOW** -- 2D only, useful for prototyping.

---

## 5. Academic Origami Simulation Codes

### 5.1 Rigid-Origami (belalugaX)

- **URL:** https://github.com/belalugaX/rigid-origami
- **License:** Check repository
- **Language:** Python

**Key Capabilities:**
- Automated rigid-origami crease pattern generation
- Folding simulation
- 3D shape approximation from origami
- Packaging optimization (minimize folded volume)
- Command-line interface with search/optimization agents

**Suitability for Ring Deployment:**
The packaging optimization (minimizing folded volume) is relevant to compact stowage of ring segments during ocean-based construction. The 3D shape approximation could help design crease patterns for curved ring segments. Being Python, it could be used as a backend tool or its algorithms could be ported to TypeScript.

**Rating: MEDIUM** -- Useful for offline design and optimization.

---

### 5.2 PyOri

- **URL:** Referenced in academic literature
- **License:** Academic
- **Language:** Python (NumPy, SciPy, PyTorch compatible)

**Key Capabilities:**
- Computational origami library for scientific studies
- Integrates with standard scientific Python ecosystem
- Fold simulation and analysis

**Suitability for Ring Deployment:**
Academic-focused Python library. Could be used for offline analysis and validation.

**Rating: LOW** -- Academic tool, not web-compatible.

---

### 5.3 FoldZ

- **URL:** https://github.com/generic-github-user/FoldZ
- **License:** Check repository
- **Language:** Python

**Key Capabilities:**
- Multipurpose computational origami toolkit
- Simulation and rendering of folding in 2D, 3D, and higher dimensions
- Linkage simulation
- Analytical and artistic contexts

**Suitability for Ring Deployment:**
Broad but not deeply specialized. Potentially useful for exploratory analysis.

**Rating: LOW**

---

### 5.4 Kinegami / KinegamiPython

- **URL:** https://github.com/SungRoboticsGroup/KinegamiPython
- **Institution:** University of Pennsylvania, Sung Robotics Lab
- **License:** Check repository
- **Language:** Python (also MATLAB version available)

**Key Capabilities:**
- Generates crease patterns for kinematic chains from tubular origami
- Converts Denavit-Hartenberg kinematic specifications into single-sheet crease patterns
- Supports revolute and prismatic joints
- Uses Dubins path planning for connecting links
- Allows adding/removing/repositioning joints in existing chains

**Suitability for Ring Deployment:**
Directly relevant to designing deployable mechanisms from tubular origami patterns. The kinematic chain approach could model ring deployment mechanisms where sections need to rotate about hinges in a specific sequence. The tubular geometry is relevant to ring-shaped structures. The Denavit-Hartenberg specification approach provides a rigorous way to define the desired kinematics.

**Rating: MEDIUM-HIGH** -- Highly relevant algorithms for ring mechanism design, but Python-only.

---

## 6. Web-Based Origami Simulators and Three.js Projects

### 6.1 Origami with Three.js (Kelley van Evert)

- **URL:** https://observablehq.com/@kelleyvanevert/origami-with-three-js
- **License:** Observable notebook (check)
- **Language:** JavaScript + Three.js

**Key Capabilities:**
- Observable notebook demonstrating origami folding with Three.js
- Step-by-step fold construction
- Interactive 3D visualization

**Suitability for Ring Deployment:**
Useful as a code reference for implementing origami folding in Three.js. Demonstrates the basic approach of applying fold transformations to mesh geometry.

**Rating: LOW** -- Reference implementation only.

---

### 6.2 Paperfold (mrflix)

- **URL:** https://github.com/mrflix/paperfold
- **License:** MIT
- **Language:** JavaScript

**Key Capabilities:**
- 3D paper fold animation for DOM elements
- CSS3 transform-based folding effects

**Suitability for Ring Deployment:**
Visual effect library, not simulation. Not applicable.

**Rating: NONE**

---

### 6.3 FEAScript

- **URL:** https://feascript.com/
- **License:** Open source
- **Language:** JavaScript

**Key Capabilities:**
- Lightweight finite element analysis library in JavaScript
- Browser-based and server-side (Node.js)
- Physics and engineering simulation

**Suitability for Ring Deployment:**
A JavaScript FEA library could complement origami simulation by providing structural analysis capabilities (stress, strain, deflection) for ring segments during and after deployment. However, it would not handle deployment kinematics directly.

**Rating: LOW-MEDIUM** -- Potential complement for structural analysis.

---

## 7. Recommended Integration Architecture

Based on this evaluation, the following architecture is recommended for simulating ring deployment in a web application:

### Core Simulation Stack

```
Layer 4: Visualization     Three.js (rendering, camera, interaction)
Layer 3: Animation         GSAP or custom (deployment sequence control)
Layer 2: Physics           Rapier.js (rigid body + hinge constraints)
                           OR Origami Simulator (GPU-accelerated origami physics)
Layer 1: Data              FOLD format (crease patterns, fold states)
                           Rabbit Ear (FOLD manipulation)
Layer 0: Design            Offline tools (SWOMPS, Crane, Kinegami)
```

### Approach A: Rigid-Body Deployment (Recommended for Primary Simulation)

Use Rapier.js to model ring segments as rigid bodies connected by revolute joints (hinge constraints). Drive deployment by setting target joint angles over time. This approach:

- Models thick-panel origami correctly (rigid panels, rotational hinges)
- Handles contact and collision during deployment
- Provides physically realistic dynamics (inertia, gravity, constraint forces)
- Runs at interactive frame rates via WASM
- Integrates cleanly with Three.js

### Approach B: GPU-Accelerated Sheet Simulation (For Flexible/Membrane Structures)

Use Origami Simulator's approach (or gpu-io directly) to simulate flexible panel deployment and inflatable structure expansion. This approach:

- Models panel bending and deformation
- Handles large numbers of mesh elements via GPU parallelism
- Is more appropriate for thin, flexible structures
- Captures continuous deformation (not just rigid folding)

### Approach C: Hybrid

Use Rapier.js for the primary rigid structure (ring segments, deployment arms, locking mechanisms) and Origami Simulator for flexible elements (solar panels, thermal shields, habitat membranes). Connect the two simulations through shared boundary conditions.

### Data Pipeline

1. **Design Phase** (offline): Use Crane (Grasshopper), Kinegami (Python), or SWOMPS (MATLAB) to design and validate deployment patterns
2. **Export**: Convert designs to FOLD format
3. **Import**: Load FOLD data into the web application using the FOLD JavaScript library
4. **Simulate**: Run deployment simulation using Rapier.js and/or Origami Simulator
5. **Visualize**: Render with Three.js, animate with GSAP or custom timeline controls

---

## 8. Summary Table

| Package | Language | License | Web-Ready | Physics | Thick Panels | Rating |
|---------|----------|---------|-----------|---------|-------------|--------|
| **Origami Simulator** | JS/WebGL | MIT | Yes | GPU-accelerated truss | No (sheet) | HIGH |
| **Rabbit Ear** | JS | MIT | Yes | None (math/data) | N/A | MEDIUM |
| **FOLD** | JS | MIT | Yes | None (data format) | N/A | MEDIUM-HIGH |
| **gpu-io** | TS/JS | MIT | Yes | GPU compute layer | N/A | HIGH |
| **Rapier.js** | Rust/WASM | Apache 2.0 | Yes | Rigid body + joints | Yes (rigid) | HIGH |
| **Cannon-es** | JS | MIT | Yes | Rigid body + joints | Yes (rigid) | MEDIUM |
| **Ammo.js** | C++/WASM | zlib | Yes | Rigid + soft body | Partial | MEDIUM |
| **SWOMPS** | MATLAB | Academic | No | Bar-and-hinge multi-physics | Yes | HIGH (reference) |
| **MERLIN/MERLIN2** | MATLAB | Academic | No | Nonlinear structural | Yes | MEDIUM-HIGH (ref) |
| **Sim-FAST** | MATLAB | Academic | No | Active structures | Yes | MEDIUM (ref) |
| **Tachi Suite** | Native | Non-commercial | No | Rigid origami kinematics | No | HIGH (reference) |
| **Kinegami** | Python | Academic | No | Kinematic chains | Yes (tubular) | MEDIUM-HIGH (ref) |
| **Crane** | C#/Grasshopper | Check | No | Rigid folding + form-finding | Yes (thickening) | MEDIUM (offline) |
| **Miura-Ori Gen** | JS | Check | Yes | None (pattern gen) | N/A | MEDIUM |
| **Rigid-Origami** | Python | Check | No | Folding simulation | No | MEDIUM |

---

## 9. Key Observations

1. **The JavaScript origami ecosystem is centered on Origami Simulator and FOLD.** These two projects, both connected to MIT, form the backbone of web-based origami computation.

2. **There is a gap between paper origami tools and engineering deployment simulation.** Most web-based tools assume zero-thickness sheets, while real deployable structures have thick panels. The MATLAB tools (SWOMPS, MERLIN) address this but are not web-compatible.

3. **The bar-and-hinge model is the dominant approach** in academic origami simulation. Reimplementing this in TypeScript for the web would be a significant contribution.

4. **Rapier.js is the best path for interactive deployment simulation** of rigid-panel structures. Its hinge constraint system directly models the kinematics of origami deployment, and its WASM performance is suitable for real-time interaction.

5. **Miura-ori is the most deployment-relevant origami pattern** with heritage in space applications (Japanese Space Flyer Unit solar arrays, NASA JPL research). Single-degree-of-freedom deployment is ideal for ring segment unfolding.

6. **The overall stack of FOLD + Rabbit Ear + Origami Simulator + Rapier.js + Three.js** provides a complete pipeline from crease pattern design through physics simulation to interactive 3D visualization, all MIT/Apache licensed and web-native.

---

## 10. References

- Ghassaei, A., Demaine, E., Gershenfeld, N. "Fast, Interactive Origami Simulation using GPU Computation." 7OSME. https://github.com/amandaghassaei/OrigamiSimulator
- Tachi, T. "Simulation of Rigid Origami." https://origami.c.u-tokyo.ac.jp/~tachi/software/
- Demaine, E., et al. FOLD File Format Specification. https://github.com/edemaine/fold
- Zhu, Y., Filipov, E.T. "Sequentially Working Origami Multi-Physics Simulator (SWOMPS)." IDETC-CIE 2021. https://github.com/zzhuyii/OrigamiSimulator
- Liu, K., Paulino, G.H. "MERLIN: A MATLAB Implementation to Capture Highly Nonlinear Behavior of Non-Rigid Origami."
- Liu, K., Paulino, G.H. "Highly Efficient Nonlinear Structural Analysis of Origami Assemblages Using the MERLIN2 Software."
- Feshbach, D., Sung, C. "Kinegami: Open-Source Software for Creating Kinematic Chains from Tubular Origami." https://github.com/SungRoboticsGroup/KinegamiPython
- Lang, R.J. "TreeMaker." https://langorigami.com/article/treemaker/
- Rabbit Ear. https://rabbitear.org/
- Rapier Physics Engine. https://rapier.rs/
- gpu-io. https://github.com/amandaghassaei/gpu-io
- Miura, K. "Method of Packaging and Deployment of Large Membranes in Space." 1985.
- NASA JPL. "Solar Power, Origami-Style." https://www.jpl.nasa.gov/news/solar-power-origami-style/
- Meloni, M. et al. "Engineering Origami: A Comprehensive Review of Recent Applications, Design Methods, and Tools." Advanced Science, 2021.
