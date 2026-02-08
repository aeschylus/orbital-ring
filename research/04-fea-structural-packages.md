# FEA & Structural Simulation Packages for Orbital Ring Web Application

## Purpose

Evaluate open-source finite element analysis (FEA) and structural simulation software for use in a JavaScript/TypeScript web application (directly or compiled to WASM). The simulation must handle:

- Tensile structures (cables, tethers) under gravity, wind, thermal loads
- Cable catenary shapes with dynamic loading
- Structural integrity of a 32,000 km tethered ring at 32 km altitude
- Stress/strain analysis on ring segments during construction and deployment
- Maglev track deformation and resonance analysis
- Materials with specific properties (Kevlar Y/rho = 230 km^2/s^2, carbon nanotubes)

## Summary & Recommendations

### Tier 1: Best Candidates for Web Integration

| Package | Approach | Why |
|---------|----------|-----|
| **CalculiX (via WASM)** | Compile CCX to WASM via Emscripten | Industry-grade nonlinear structural solver; cable/beam elements; thermal coupling |
| **MFEM (via WASM)** | Compile to WASM via Emscripten | Modular C++ FEM library from LLNL; high-order elements; excellent architecture |
| **FEAScript** | Native JS | Only actively maintained pure-JS FEA library; MIT license; lightweight |
| **Custom solver + linear-algebra-js** | Native JS/WASM hybrid | Eigen compiled to asm.js; sparse matrix support; build domain-specific solver |

### Tier 2: Strong Backend/Computation Options

| Package | Approach | Why |
|---------|----------|-----|
| **OpenSees** | Python/C++ backend, results to browser | Cable elements, dynamic analysis, earthquake-grade resonance analysis |
| **FEniCSx** | Python backend, results to browser | General PDE solver; can formulate any structural problem; active community |
| **Code_Aster** | Python/Fortran backend | 200+ constitutive laws; vibration analysis; rotating machinery |

### Tier 3: Supporting Tools

| Package | Role | Why |
|---------|------|-----|
| **Rapier.js** | Real-time physics visualization | Rust->WASM; rigid body physics for interactive demos |
| **Verlet.js / VerletExpress** | Cable/tether visualization | Lightweight rope/cable physics for visual demonstrations |
| **triangle-wasm** | Mesh generation | Triangle mesh generator compiled to WASM; FEA pre-processing |
| **three.js** | Visualization | 3D rendering; Project Atlantis already uses this |
| **Gmsh** | Mesh generation (backend) | Industry-standard mesh generator; Python API |

---

## 1. JavaScript/TypeScript FEA Libraries

### 1.1 FEAScript

- **URL**: https://feascript.com/ | https://github.com/FEAScript/FEAScript-core
- **License**: MIT
- **Language**: Pure JavaScript
- **npm**: `feascript`

**Capabilities:**
- Heat conduction solver
- Front propagation solver
- Simple mesh generation (1D and rectangular 2D)
- Unstructured mesh import from Gmsh
- Linear system solvers (LU decomposition, Jacobi method)
- Newton-Raphson method for nonlinear problems
- Web worker support for multi-threaded computation
- Visual block-based editor (Blockly-based)

**Community Activity:** Active development (2023-2025). Featured on Hacker News (Aug 2025). Under heavy development with frequent releases.

**Suitability for Orbital Ring:** LOW-MEDIUM. FEAScript is the most viable pure-JS FEA library, but it currently focuses on heat conduction problems, not structural mechanics. It lacks beam/cable elements, nonlinear geometric analysis, and dynamic solvers needed for tether simulation. However, its architecture and MIT license make it a potential foundation to extend with structural solvers. The web worker support is valuable for our use case.

---

### 1.2 js-fea

- **URL**: https://github.com/lge88/js-fea
- **License**: MIT
- **Language**: Pure JavaScript
- **npm**: `js-fea` (v0.0.1)

**Capabilities:**
- General-purpose FEA in pure JavaScript
- Basic element types

**Community Activity:** Last published 9+ years ago. Effectively abandoned.

**Suitability for Orbital Ring:** VERY LOW. Abandoned project. Not suitable for production use.

---

### 1.3 numeric.js (Numeric Javascript)

- **URL**: https://ccc-js.github.io/numeric2/documentation.html
- **License**: MIT
- **Language**: JavaScript

**Capabilities:**
- Linear algebra (vectors, matrices)
- LU decomposition, matrix inverse, solve Ax=b
- Complex numbers
- Spline interpolation
- ODE solver
- Unconstrained optimization
- Sparse linear algebra
- PDE support (basic)

**Community Activity:** Mature but minimally maintained. "Pretty much non-existent documentation."

**Suitability for Orbital Ring:** MEDIUM (as building block). Not an FEA solver itself, but provides the numerical primitives (sparse solvers, ODE integrators) needed to build one. Could serve as foundation for a custom cable/tether solver. The sparse matrix and ODE capabilities are directly relevant.

---

### 1.4 math.js

- **URL**: https://mathjs.org/
- **License**: Apache-2.0
- **Language**: JavaScript/TypeScript

**Capabilities:**
- Comprehensive math library
- Sparse matrix support (Compressed Column Storage)
- Matrix operations, decompositions
- Expression parser
- Unit conversions
- Extensive function library

**Community Activity:** Very active. Well-maintained. Large user base.

**Suitability for Orbital Ring:** MEDIUM (as building block). Excellent sparse matrix support and comprehensive math functions. Better documented and maintained than numeric.js. Good foundation for building custom solvers. Unit conversion support is useful for engineering calculations.

---

### 1.5 linear-algebra-js

- **URL**: https://rohan-sawhney.github.io/linear-algebra-js/ | https://github.com/rohan-sawhney/linear-algebra-js
- **License**: MIT
- **Language**: JavaScript (asm.js compiled from C++ Eigen via Emscripten)

**Capabilities:**
- Sparse matrix operations
- Linear system solving with LU factorization
- Near-native performance via asm.js
- Wraps C++ Eigen library
- Plans to integrate SuiteSparse

**Community Activity:** Niche but functional. Part of the geometry-processing-js ecosystem.

**Suitability for Orbital Ring:** HIGH (as building block). This is the most performant sparse linear algebra option for the browser. Since FEA ultimately reduces to solving large sparse linear systems, this library (Eigen compiled to asm.js) provides the critical performance layer. Combined with a custom element formulation layer, this could be the core of a browser-based structural solver.

---

### 1.6 TensorFlow.js

- **URL**: https://www.tensorflow.org/js
- **License**: Apache-2.0
- **Language**: JavaScript/TypeScript

**Capabilities:**
- GPU-accelerated tensor operations (WebGL/WebGPU backend)
- Matrix multiplication, transpose, decomposition
- Automatic differentiation
- Broad platform support

**Community Activity:** Very active (Google-backed).

**Suitability for Orbital Ring:** LOW-MEDIUM. Primarily designed for ML, not FEA. GPU acceleration is attractive for large matrix operations, but the API is oriented toward neural networks, not sparse linear algebra. Automatic differentiation could be useful for sensitivity analysis. Not a natural fit but could be leveraged for specific computational kernels.

---

## 2. Python FEA (Backend / Wrapped)

### 2.1 FEniCSx (DOLFINx)

- **URL**: https://fenicsproject.org/
- **License**: LGPL
- **Language**: Python frontend, C++ backend (DOLFINx)

**Capabilities:**
- General PDE solver using FEM
- Linear and nonlinear elasticity
- Navier-Stokes equations
- Arbitrary weak form specification
- High-performance C++ backend
- Adaptive mesh refinement
- FEniCS-Shells extension for plates/shells
- Parallel computing support

**Community Activity:** Very active. Large academic community. Extensive documentation and tutorials. Regular releases through 2025.

**Suitability for Orbital Ring:** HIGH (as backend). FEniCSx can formulate virtually any structural problem through its weak form language. Cable catenary under gravity, wind loading, thermal expansion -- all expressible as PDEs. The high-performance C++ backend handles large problems. Would need a Python backend service sending results to the browser for visualization. Not suitable for direct browser execution, but excellent for computation.

**Integration Strategy:** Python backend service (FastAPI/Flask) running FEniCSx computations, sending mesh + results as JSON/binary to Three.js frontend.

---

### 2.2 SfePy (Simple Finite Elements in Python)

- **URL**: https://sfepy.org/
- **License**: BSD
- **Language**: Python (with C extensions)

**Capabilities:**
- Coupled PDE systems in 1D, 2D, 3D
- Material stiffness tensor computation (sfepy.mechanics.matcoefs)
- Homogenization of porous media
- Phononic material analysis
- Shape optimization
- Isogeometric analysis (preliminary)

**Community Activity:** Active. Regular releases through 2025 (versions 2025.1-2025.4).

**Suitability for Orbital Ring:** MEDIUM. Good for material property modeling and homogenization (relevant for composite tether materials). The material coefficient module could help model Kevlar and CNT properties. Less suitable than FEniCSx for the core structural dynamics problem.

---

### 2.3 PyMAPDL (ANSYS)

- **URL**: https://mapdl.docs.pyansys.com/
- **License**: MIT (Python wrapper); ANSYS solver requires commercial license
- **Language**: Python wrapper around ANSYS MAPDL (Fortran/C++)

**Capabilities:**
- Full ANSYS MAPDL capability through Python
- Cable/link elements
- Nonlinear analysis
- Dynamic/transient analysis
- Thermal-mechanical coupling
- Parametric studies and batch processing

**Community Activity:** Active (Ansys-backed). Good documentation and examples.

**Suitability for Orbital Ring:** HIGH capability, LOW feasibility. ANSYS MAPDL is arguably the most capable FEA solver for our problem set (cable elements, thermal coupling, dynamic analysis). However, it requires a commercial ANSYS license, making it unsuitable for an open-source web application. The PyMAPDL Python API is MIT-licensed, but it's just a wrapper -- the solver itself is proprietary.

---

### 2.4 OpenSeesPy

- **URL**: https://opensees.berkeley.edu/ | https://opensees.github.io/OpenSeesDocumentation/
- **License**: BSD (mostly)
- **Language**: C++ with Tcl/Python interfaces

**Capabilities:**
- Rich element library (beams, columns, shells, cables)
- Nonlinear material models
- Static and dynamic analysis
- Earthquake response simulation
- Cable/truss elements
- Modal analysis (natural frequencies, mode shapes)
- Domain decomposition for parallel analysis
- Extensive material library

**Community Activity:** Very active. Large academic and professional community. Continuous development since 1999. Active GitHub, forums, documentation.

**Suitability for Orbital Ring:** HIGH. OpenSees was built for exactly the kind of problems we need: large-scale structural dynamics with nonlinear behavior, cable elements, resonance analysis, and dynamic loading. The cable/truss elements can model tethers directly. Modal analysis is essential for maglev track resonance studies. The earthquake loading framework can be repurposed for wind and thermal dynamic loads. The main limitation is that it runs as a backend service, not in the browser.

**Integration Strategy:** Python (OpenSeesPy) backend computing structural response, streaming results to browser for Three.js visualization. RodX (https://rodxcalc.com/) demonstrates this approach -- it's a free browser FEA tool powered by OpenSees on the backend.

---

### 2.5 PyNite

- **URL**: https://github.com/JWock82/Pynite | https://pypi.org/project/PyNiteFEA/
- **License**: MIT
- **Language**: Pure Python

**Capabilities:**
- 3D structural frame analysis
- P-delta analysis
- Tension-only and compression-only elements
- Spring elements (two-way, tension-only, compression-only)
- Rectangular plate elements
- Shear, moment, deflection diagrams
- PDF report generation
- Step loading for nonlinear scenarios
- Modal analysis for frames

**Community Activity:** Active. Regular updates. Good documentation.

**Suitability for Orbital Ring:** MEDIUM. Tension-only elements are directly relevant for tether modeling. The step loading capability helps with construction sequence simulation. However, PyNite is designed for building-scale frame structures, not planetary-scale ring structures. It lacks thermal coupling, wind loading models, and the element variety needed for the full orbital ring simulation. Could be useful for specific sub-problems (individual tether segment analysis).

---

### 2.6 XC

- **URL**: https://github.com/xcfem/xc
- **License**: GPL
- **Language**: C++ with Python scripting

**Capabilities:**
- Civil engineering structural analysis
- 0D, 1D, 2D, 3D elements
- Linear and nonlinear analysis
- Static and dynamic analysis
- Fiber section models
- Component-based FEM (CBFEM) for connections
- FreeCAD integration

**Community Activity:** Active development. Docker-based deployment.

**Suitability for Orbital Ring:** MEDIUM. Designed for civil engineering structures (bridges, buildings). Cable-stayed bridge analysis is structurally analogous to tethered ring analysis. The fiber section models could represent composite tether cross-sections. Docker deployment makes backend integration straightforward. GPL license is a consideration.

---

### 2.7 JAX-FEM

- **URL**: https://github.com/deepmodeling/jax-fem
- **License**: GPL-3.0
- **Language**: Python (JAX)

**Capabilities:**
- GPU-accelerated 3D FEM
- Automatic differentiation for inverse problems
- ~10x acceleration over commercial FEM on GPU (7.7M DOF benchmark)
- Topology optimization
- Machine learning integration
- Pure Python implementation

**Community Activity:** Active. Academic community (DeepModeling).

**Suitability for Orbital Ring:** MEDIUM-HIGH. GPU acceleration is compelling for large-scale ring structure analysis. Automatic differentiation enables design optimization (e.g., optimal tether spacing, material distribution). The main challenge is that JAX requires a GPU backend (CUDA), making browser deployment impractical. Best suited as a high-performance backend for parametric studies and optimization.

---

### 2.8 PyDy (Python Dynamics)

- **URL**: https://pydy.org/ | https://github.com/pydy/pydy
- **License**: BSD
- **Language**: Python (SymPy-based)

**Capabilities:**
- Symbolic multibody dynamics
- Equation of motion generation via SymPy.mechanics
- Numerical simulation via NumPy/SciPy
- Visualization via pythreejs (Three.js in Jupyter)
- Automatic code generation

**Community Activity:** Active. Maintained by academic community.

**Suitability for Orbital Ring:** MEDIUM. Multibody dynamics is relevant for modeling the ring as interconnected segments with joints. The symbolic equation generation could derive the governing equations for tether-ring coupling. The pythreejs visualization already uses Three.js. However, PyDy is oriented toward rigid body dynamics (mechanisms, robots), not flexible structural analysis with stress/strain.

---

## 3. C/C++ FEA with WASM Potential

### 3.1 CalculiX

- **URL**: https://www.calculix.de/ | https://www.dhondt.de/
- **License**: GPL v2+
- **Language**: C (solver CCX), C (pre/post CGX)

**Capabilities:**
- Linear and nonlinear analysis
- Static, dynamic, thermal solutions
- Implicit and explicit solvers
- Beam, shell, continuum, contact elements
- Thermal-mechanical coupling
- Frequency/modal analysis
- Buckling analysis
- Fatigue
- Parallel solvers (PARDISO, SPOOLES, PaStiX)
- ABAQUS-compatible input format

**Community Activity:** Active. v2.23 released Nov 2025. Discourse forum. GitHub repositories for tools/extensions.

**WASM Feasibility:** MEDIUM-HIGH. CalculiX CCX is written in C/Fortran, which Emscripten can compile. Key challenges: (1) Fortran numerical libraries need f2c or flang-to-LLVM conversion, (2) File I/O must be adapted to virtual filesystem, (3) Threading/MPI parallelism won't map directly to WASM. A single-threaded subset of CCX is the most viable compilation target. The input/output format (ABAQUS-style text files) translates naturally to string-based I/O in WASM.

**Suitability for Orbital Ring:** HIGH. CalculiX has the full feature set needed: beam/cable elements for tethers, thermal coupling for temperature effects at 32km altitude, dynamic analysis for wind loading, frequency analysis for maglev resonance, and nonlinear geometry for large-displacement tether catenary. The ABAQUS-compatible format means extensive documentation and examples exist for cable/tether problems.

---

### 3.2 Code_Aster

- **URL**: https://code-aster-windows.com/ | https://github.com/scimulate/code_aster
- **License**: GPL
- **Language**: Fortran + Python (mixed)

**Capabilities:**
- 200+ constitutive laws
- 400+ finite element types
- Thermo-hydro-mechanical coupling
- Vibration analysis and rotating machinery
- Frictional contact
- Finite displacements and finite strains
- Fatigue, damage, fracture mechanics
- Seismic analysis
- Porous/incompressible materials

**Community Activity:** Active. Developed by EDF (Electricite de France) R&D. Docker images available.

**WASM Feasibility:** LOW. Code_Aster is a massive Fortran/Python codebase with complex dependencies (MED, HDF5, METIS, SCOTCH, etc.). Compiling to WASM would be an enormous effort. Better suited as a Docker-based backend service.

**Suitability for Orbital Ring:** HIGH (as backend). Possibly the most comprehensive open-source FEA package. The vibration analysis for rotating machinery is directly applicable to maglev track analysis. The 200+ material models and thermo-mechanical coupling handle the full physics. The barrier is integration complexity, not capability.

---

### 3.3 MFEM

- **URL**: https://mfem.org/ | https://github.com/mfem/mfem
- **License**: BSD-3-Clause
- **Language**: C++

**Capabilities:**
- Arbitrary high-order finite elements
- Conforming and nonconforming adaptive mesh refinement
- Wide variety of discretization approaches
- PCG, MINRES, GMRES solvers
- Sparse direct solvers
- Nonlinear solvers, eigensolvers
- Explicit and implicit Runge-Kutta time integrators
- GPU acceleration (CUDA, HIP, OCCA, RAJA, OpenMP)
- Modular, library-oriented design

**Community Activity:** Very active. Developed at Lawrence Livermore National Laboratory. Well-funded. Excellent documentation. Regular releases.

**WASM Feasibility:** MEDIUM-HIGH. MFEM is a clean, modular C++ library with minimal external dependencies (can be built standalone). Its library-oriented design makes it a strong candidate for Emscripten compilation. The BSD license is permissive. Key advantage: you can compile just the solver components you need, avoiding bloat. GPU features won't work in WASM, but the CPU solvers are still performant.

**Suitability for Orbital Ring:** HIGH. MFEM's modular design allows building exactly the solver needed: high-order elements for accurate stress analysis, eigensolvers for resonance, time integrators for dynamic loading, adaptive refinement for stress concentrations at tether attachment points. The BSD license is the most permissive among the major C++ FEA libraries. Lawrence Livermore pedigree means it handles extreme-scale problems.

---

### 3.4 deal.II

- **URL**: https://dealii.org/ | https://github.com/dealii/dealii
- **License**: LGPL v2.1
- **Language**: C++

**Capabilities:**
- Dimension-independent programming
- hp-adaptivity
- Distributed meshes
- Complex geometry support
- Matrix-free algorithms
- Extensive tutorial programs (90+ step-by-step)

**Community Activity:** Very active. v9.7 released July 2025. Large academic community. Extensive documentation.

**WASM Feasibility:** LOW-MEDIUM. deal.II is a large C++ library with many dependencies (Trilinos, PETSc, METIS, etc.). While the core library could theoretically compile with Emscripten, the dependency chain makes this impractical. The library is also designed for distributed parallel computing, which doesn't map well to WASM.

**Suitability for Orbital Ring:** MEDIUM. Extremely capable solver, but the complexity of integration outweighs the benefits compared to MFEM. Better suited as a backend service if needed.

---

### 3.5 Elmer FEM

- **URL**: https://www.elmerfem.org/ | https://github.com/ElmerCSC/elmerfem
- **License**: GPL
- **Language**: Fortran + C

**Capabilities:**
- Fluid dynamics
- Structural mechanics
- Electromagnetics
- Heat transfer
- Acoustics
- Coupled multiphysics
- CMake build system

**Community Activity:** Active. Developed by CSC (Finnish IT Center for Science). Good documentation.

**WASM Feasibility:** LOW. Primarily Fortran, with C components. The Fortran core would need conversion or flang compilation to LLVM, then Emscripten. Complex dependency chain. Not a practical WASM target.

**Suitability for Orbital Ring:** MEDIUM-HIGH (as backend). The multiphysics coupling (electromagnetic + structural + thermal) is directly relevant for maglev track simulation. Could model the interaction between magnetic levitation forces and structural deformation simultaneously.

---

### 3.6 FreeFEM

- **URL**: https://freefem.org/ | https://github.com/FreeFem/FreeFem-sources
- **License**: LGPL
- **Language**: C++ with custom scripting language

**Capabilities:**
- Navier-Stokes, linear/nonlinear elasticity
- Thermodynamics, magnetostatics, electrostatics
- Fluid-structure interaction
- Adaptive mesh refinement
- 2D and 3D problems
- Time-dependent simulations

**Community Activity:** Active. Well-established in academic community.

**WASM Feasibility:** LOW-MEDIUM. C++ core could theoretically compile, but the custom scripting language interpreter adds complexity.

**Suitability for Orbital Ring:** MEDIUM. Good multiphysics capabilities, but the custom scripting language is a barrier to integration compared to library-oriented tools like MFEM.

---

### 3.7 OOFEM

- **URL**: https://www.oofem.org/ | https://github.com/Micket/oofem
- **License**: LGPL
- **Language**: C++

**Capabilities:**
- Mechanical, transport, fluid mechanics
- Object-oriented architecture
- Large deformation support (OOFEM_LargeDef fork)
- Cross-platform (Unix, Windows)
- CMake build system

**Community Activity:** Moderate. Academic project.

**WASM Feasibility:** MEDIUM. Clean C++ with CMake. Fewer dependencies than deal.II or Code_Aster. The object-oriented architecture is relatively modular.

**Suitability for Orbital Ring:** MEDIUM. The large deformation fork is relevant for tether catenary analysis. Object-oriented design makes extension easier. However, less community support and documentation than the top-tier options.

---

### 3.8 Sparselizard

- **URL**: https://www.sparselizard.org/ | https://github.com/halbux/sparselizard
- **License**: GPL
- **Language**: C++

**Capabilities:**
- Structural mechanics (anisotropic elasticity, geometric nonlinearity, buckling, contact)
- Fluid flow, thermal, electromagnetic
- Piezoelectric, superconductor problems
- Linear hardening elastoplastic
- Transient, harmonic, eigenmode analysis
- Conformal adaptive mesh refinement
- Mesh-to-mesh interpolation
- Mortar finite element method
- Periodic conditions
- Circuit coupling

**Community Activity:** Active. Growing community. Published research papers.

**WASM Feasibility:** MEDIUM. Modern C++ with CMake. Research-oriented codebase, but dependencies may be manageable.

**Suitability for Orbital Ring:** HIGH. Sparselizard is notably one of the few open-source FEA packages with superconductor modeling -- directly relevant for maglev coil simulation. The combination of structural mechanics with electromagnetic coupling models the maglev-structure interaction. Geometric nonlinearity handles tether large displacements. Eigenmode analysis covers resonance. The periodic conditions support is useful for modeling repeating ring segments.

---

### 3.9 GetFEM

- **URL**: https://getfem.org/
- **License**: LGPL
- **Language**: C++ with Python/Octave/Scilab/Matlab interfaces

**Capabilities:**
- Arbitrary weak form specification
- Automatic tangent system derivation for nonlinear problems
- Optimized assembly compilation
- Multiple language interfaces
- Flexible framework

**Community Activity:** Active. Academic community.

**WASM Feasibility:** MEDIUM. C++ core with well-defined interfaces. Could potentially compile the core library.

**Suitability for Orbital Ring:** MEDIUM. The weak form language is powerful for formulating novel problems (like tethered ring equilibrium). But similar capabilities are available in FEniCSx with a larger community.

---

### 3.10 PolyFEM

- **URL**: https://polyfem.github.io/ | https://github.com/polyfem/polyfem
- **License**: MIT
- **Language**: C++

**Capabilities:**
- Polyhedral element support
- St. Venant-Kirchhoff elasticity
- JSON configuration interface
- hp-adaptivity up to order 4
- Spline and polygonal bases
- Cross-platform (Windows, macOS, Linux)
- CMake build

**Community Activity:** Active. Academic (NYU Geometric Computing Lab).

**WASM Feasibility:** MEDIUM. MIT license, CMake build, C++. Clean codebase. JSON interface is naturally WASM-friendly.

**Suitability for Orbital Ring:** MEDIUM. The JSON interface would make WASM integration clean. MIT license is ideal. However, the physics capabilities are more limited than CalculiX or MFEM for our specific structural dynamics needs.

---

### 3.11 GooseFEM

- **URL**: https://github.com/tdegeus/GooseFEM
- **License**: MIT
- **Language**: C++ with Python interface

**Capabilities:**
- Static and dynamic finite element computations
- C++ core with Python interface
- Lightweight library design

**Community Activity:** Moderate. Academic project.

**WASM Feasibility:** MEDIUM-HIGH. MIT license, lightweight C++ design. Good candidate for WASM compilation if the feature set is sufficient.

**Suitability for Orbital Ring:** LOW-MEDIUM. Too lightweight for the full simulation needs, but could serve as a learning reference for WASM FEA architecture.

---

## 4. Web-Based Structural Analysis Platforms

### 4.1 SPARSELAB

- **URL**: https://sparselab.com/
- **License**: Proprietary (SaaS)
- **Language**: C++ solver + Svelte frontend

**Capabilities:**
- Cloud-based FEA in browser
- High-performance C++ solver with multi-threading
- WebAssembly-based modeling environment
- STEP CAD geometry import
- Static stress analysis

**Suitability for Orbital Ring:** Reference architecture. SPARSELAB demonstrates that browser-based FEA with WASM preprocessing and cloud computation is viable. Their architecture (Svelte + WASM + C++ cloud solver) is a potential model for our application.

---

### 4.2 SkyCiv

- **URL**: https://skyciv.com/
- **License**: Proprietary (SaaS)

**Capabilities:**
- Browser-based 3D structural analysis
- Full FEA suite
- Cable/tension member support
- API access

**Suitability for Orbital Ring:** LOW (proprietary). Reference for UI/UX of browser-based structural analysis.

---

### 4.3 WeStatiX

- **URL**: https://westatix.com/
- **License**: Proprietary (SaaS)

**Capabilities:**
- Cloud-based 3D structural analysis
- Real-time input validation
- Parametric GUI
- Structural health monitoring (SHM)
- Mobile-friendly

**Suitability for Orbital Ring:** LOW (proprietary). The parametric GUI and SHM concepts are relevant for our ring monitoring simulation.

---

### 4.4 SimScale

- **URL**: https://www.simscale.com/
- **License**: Proprietary (SaaS, uses Code_Aster backend)

**Capabilities:**
- Cloud-native structural analysis
- Uses Code_Aster as FEA backend
- Linear/nonlinear static analysis
- Modal analysis
- Thermal analysis

**Suitability for Orbital Ring:** LOW (proprietary). Notable because it demonstrates Code_Aster as a web-accessible backend, validating that architecture.

---

### 4.5 CAEplex

- **URL**: https://www.caeplex.com/
- **License**: Open-source backend (Fino + Gmsh), proprietary frontend

**Capabilities:**
- Browser-based FEA
- Uses Gmsh for meshing + Fino for solving
- Thermo-mechanical analysis
- Onshape App Store integration

**Suitability for Orbital Ring:** MEDIUM as architecture reference. The Gmsh + open-source solver + browser frontend pattern is directly applicable.

---

### 4.6 RodX

- **URL**: https://rodxcalc.com/
- **License**: Free (browser-based, uses OpenSees backend)

**Capabilities:**
- 2D FEA for beams, trusses, frames
- Powered by OpenSees
- No installation needed

**Suitability for Orbital Ring:** LOW (2D only). But validates the "OpenSees as web backend" architecture.

---

### 4.7 CalcForge

- **URL**: https://calcforge.com/
- **License**: Free (browser-based)

**Capabilities:**
- 3D structural finite element analysis
- Bending moment, shear force, deflection
- Frame structure analysis

**Suitability for Orbital Ring:** LOW. Basic frame analysis only.

---

## 5. Cable/Tether-Specific Tools

### 5.1 Project Atlantis TetheredRing Simulation

- **URL**: https://github.com/philipswan/TetheredRing
- **License**: (Check repo)
- **Language**: JavaScript + Three.js

**Capabilities:**
- 3D visualization of the tethered ring concept
- Interactive parameters
- Catenary cable visualization
- Ring-Earth-tether geometry
- Custom physics for inertial + tensile force balance

**Community Activity:** Active development by Philip Swan.

**Suitability for Orbital Ring:** VERY HIGH (reference implementation). This is the most directly relevant existing codebase. It models the exact structure we're simulating. Study this code first for domain physics, then augment with proper FEA for stress/strain analysis.

---

### 5.2 Catenary Cable FEA (Python course/library)

- **URL**: https://www.engineeringskills.com/course/non-linear-finite-element-analysis-of-2d-catenary-and-cable-structures
- **Language**: Python (educational)

**Capabilities:**
- Nonlinear FEA for 2D catenary structures
- Geometric nonlinearity handling
- Cable element formulation
- Step-by-step implementation

**Suitability for Orbital Ring:** MEDIUM (educational). Provides the mathematical formulation and Python implementation for catenary cable FEA. This can be translated to JavaScript/TypeScript or used as the theoretical basis for our custom solver.

---

## 6. Physics Engines for Visualization

### 6.1 Rapier

- **URL**: https://rapier.rs/ | https://github.com/dimforge/rapier.js
- **License**: Apache-2.0
- **Language**: Rust compiled to WASM
- **npm**: `@dimforge/rapier3d`, `@dimforge/rapier2d`

**Capabilities:**
- Rigid body dynamics
- Collision detection
- Joints and constraints (ragdolls, vehicles, robots)
- Contact events, scene queries
- Cross-platform determinism
- World snapshots (serialize/deserialize)

**Community Activity:** Very active. Professional quality. Regular releases.

**Suitability for Orbital Ring:** MEDIUM. Best-in-class WASM physics engine for the browser. Useful for interactive rigid-body visualization of ring segments, construction sequence animation, and real-time demonstration of forces. Not suitable for actual FEA (no stress/strain, no flexible bodies), but excellent for the interactive/educational visualization layer.

---

### 6.2 Cannon.js / cannon-es

- **URL**: https://github.com/schteppe/cannon.js | https://pmndrs.github.io/cannon-es/
- **License**: MIT
- **Language**: JavaScript

**Capabilities:**
- Rigid body physics
- Collision detection
- Constraint solver (Gauss-Seidel)
- Spring constraints
- Shapes: sphere, plane, box, cylinder, convex polyhedron, heightfield

**Community Activity:** Original cannon.js is archived. cannon-es (maintained fork by pmndrs) is active.

**Suitability for Orbital Ring:** LOW. Spring constraints could approximate cable behavior for visualization, but no structural analysis capability. Rapier is the better choice for physics visualization.

---

### 6.3 Ammo.js

- **URL**: https://github.com/nicedozie4u/ammo.js (various forks)
- **License**: zlib (Bullet license)
- **Language**: C++ (Bullet) compiled to JavaScript via Emscripten

**Capabilities:**
- Full Bullet physics engine in JavaScript
- Rigid and soft body simulation
- Cloth simulation
- Rope/cable simulation via soft bodies
- Web Worker support (via Physijs)

**Community Activity:** Moderate. Multiple forks. Heavy file size.

**Suitability for Orbital Ring:** LOW-MEDIUM. The soft body and rope simulation capabilities are more relevant than cannon.js for cable visualization. However, it's a large library and the physics are game-grade, not engineering-grade. Could be useful for quick visual demonstrations of cable behavior.

---

### 6.4 Verlet.js

- **URL**: https://github.com/subprotocol/verlet-js
- **License**: MIT
- **Language**: JavaScript

**Capabilities:**
- Particle-based physics
- Distance constraints (rigid links)
- Angular constraints
- Pin/anchor constraints
- Verlet integration (stable, efficient)

**Community Activity:** Mature. Not actively developed but stable.

**Suitability for Orbital Ring:** MEDIUM (for visualization). Verlet integration is physically correct for cable/rope simulation. A chain of particles with distance constraints naturally produces catenary shapes. Lightweight and easy to integrate with Three.js. Good for real-time cable shape visualization, not for stress analysis.

---

### 6.5 VerletExpressJS

- **URL**: https://github.com/matthewmain/VerletExpressJS
- **License**: MIT
- **Language**: JavaScript

**Capabilities:**
- 2D and 3D Verlet physics
- Gravity, velocity, collisions
- Soft bodies, rigid bodies, ropes, cloth
- Point anchoring

**Community Activity:** Small but functional.

**Suitability for Orbital Ring:** MEDIUM (for visualization). Similar to Verlet.js but with 3D support. Directly useful for real-time tether visualization.

---

## 7. Mesh Generation & Pre-Processing (Supporting Tools)

### 7.1 triangle-wasm

- **URL**: https://github.com/brunoimbrizi/triangle-wasm | https://www.npmjs.com/package/triangle-wasm
- **License**: MIT (wrapper) / custom (Triangle library)
- **Language**: C compiled to WASM

**Capabilities:**
- 2D Delaunay triangulation
- Constrained/conforming Delaunay triangulation
- Voronoi diagrams
- Quality mesh generation for FEA

**Suitability for Orbital Ring:** HIGH (supporting tool). Browser-based mesh generation is essential for any in-browser FEA workflow. This provides the 2D meshing capability.

---

### 7.2 Gmsh

- **URL**: https://gmsh.info/
- **License**: GPL v2+
- **Language**: C++

**Capabilities:**
- 3D mesh generation with built-in CAD engine
- Parametric geometry
- C++, Python, Julia, Fortran APIs
- Constructive solid geometry (OpenCASCADE)
- Mesh optimization

**Suitability for Orbital Ring:** HIGH (as backend tool). Industry-standard mesh generator. Python API integrates well with FEniCSx, OpenSees, etc. Not available in browser natively, but could potentially be compiled to WASM for the core meshing engine.

---

## 8. Architecture Recommendations

### Recommended Architecture: Hybrid Browser + Backend

Given the analysis above, the optimal architecture for the orbital ring simulation is a hybrid approach:

```
+--------------------------------------------------+
|                    BROWSER                        |
|                                                   |
|  Three.js (3D visualization)                      |
|       |                                           |
|  Rapier.js (interactive physics demos)            |
|       |                                           |
|  Verlet.js (real-time cable visualization)        |
|       |                                           |
|  FEAScript or Custom JS solver (light FEA)        |
|  + linear-algebra-js (Eigen/WASM sparse solver)   |
|       |                                           |
|  triangle-wasm (2D mesh generation)               |
+--------------------------------------------------+
          |  WebSocket / REST API  |
+--------------------------------------------------+
|                   BACKEND                         |
|                                                   |
|  OpenSees (structural dynamics, cable elements)   |
|  FEniCSx  (general PDE, custom formulations)      |
|  CalculiX (full nonlinear FEA, thermal coupling)  |
|  Gmsh     (3D mesh generation)                    |
+--------------------------------------------------+
```

### Phase 1: Visualization & Interactive Demo
- Three.js + Verlet.js for real-time tether catenary visualization
- Study Project Atlantis TetheredRing code (https://github.com/philipswan/TetheredRing)
- Simple analytical cable models in JavaScript

### Phase 2: Browser-Based Light FEA
- linear-algebra-js (Eigen via WASM) for sparse matrix solving
- Custom 1D/2D cable finite elements in TypeScript
- triangle-wasm for mesh generation
- Implement catenary cable element with gravity + wind loading

### Phase 3: Full Structural Analysis Backend
- OpenSees for cable dynamics and resonance analysis
- FEniCSx for custom PDE formulations (thermal-structural coupling)
- CalculiX for full 3D nonlinear FEA (ring segment stress analysis)
- Results streamed to browser for Three.js visualization

### Phase 4: WASM Compilation of C++ Solver
- Compile subset of MFEM to WASM via Emscripten (BSD license, modular)
- Or compile CalculiX CCX core to WASM (more features, GPL license)
- Full FEA capability in the browser without backend dependency

---

## 9. Key Technical Considerations

### 9.1 Scale Challenges
The 32,000 km ring structure presents unique numerical challenges:
- **Floating point precision**: At planetary scale, standard double precision (15-16 significant digits) gives ~1cm precision. This is adequate for structural analysis but requires careful coordinate system management.
- **Element count**: A full ring mesh could easily exceed millions of elements. WASM memory limits (currently 4 GB, expanding with WASM 64-bit) constrain in-browser analysis.
- **Multi-scale**: Tether cross-section (cm) vs. ring circumference (32,000 km) spans ~9 orders of magnitude. Requires hierarchical modeling.

### 9.2 Material Modeling
- **Kevlar**: Y/rho = 230 km^2/s^2. Standard linear elastic or fiber-reinforced composite models. Available in most FEA packages.
- **Carbon nanotubes**: Theoretical 100 GPa tensile strength. Research-grade material models. May need custom constitutive law implementation.
- **Temperature effects at 32 km**: -50C to +20C range. Coefficient of thermal expansion modeling needed. CalculiX and Code_Aster have mature thermal coupling.

### 9.3 Dynamic Loading
- **Wind**: Stratospheric jet streams at 32 km altitude. Time-varying distributed loads on tethers. OpenSees excels at dynamic time-history analysis.
- **Maglev resonance**: Periodic forcing from maglev vehicles. Modal analysis + forced vibration response. CalculiX frequency response or OpenSees modal analysis.
- **Construction sequence**: Progressive loading as ring rises from ocean to 32 km. Nonlinear geometry (large displacements). Step loading in PyNite or full nonlinear in CalculiX.

### 9.4 License Summary

| Package | License | Commercial Use | WASM Distribution |
|---------|---------|----------------|-------------------|
| MFEM | BSD-3 | Yes | Yes |
| FEAScript | MIT | Yes | N/A (already JS) |
| linear-algebra-js | MIT | Yes | N/A (already asm.js) |
| PolyFEM | MIT | Yes | Yes |
| GooseFEM | MIT | Yes | Yes |
| triangle-wasm | MIT/custom | Yes (with attribution) | Yes |
| Rapier.js | Apache-2.0 | Yes | Yes |
| CalculiX | GPL v2 | Copyleft | Must distribute source |
| Code_Aster | GPL | Copyleft | Must distribute source |
| Sparselizard | GPL | Copyleft | Must distribute source |
| FEniCSx | LGPL | Yes (with conditions) | Library linking OK |
| OOFEM | LGPL | Yes (with conditions) | Library linking OK |
| OpenSees | BSD (mostly) | Yes | Yes |
| deal.II | LGPL | Yes (with conditions) | Library linking OK |

---

## 10. Sources

- [FEAScript](https://feascript.com/) | [GitHub](https://github.com/FEAScript/FEAScript-core)
- [numeric.js](https://ccc-js.github.io/numeric2/documentation.html)
- [math.js](https://mathjs.org/)
- [linear-algebra-js](https://rohan-sawhney.github.io/linear-algebra-js/) | [GitHub](https://github.com/rohan-sawhney/linear-algebra-js)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [FEniCSx](https://fenicsproject.org/)
- [SfePy](https://sfepy.org/)
- [PyMAPDL](https://mapdl.docs.pyansys.com/)
- [OpenSees](https://opensees.berkeley.edu/) | [OpenSeesPy](https://opensees.github.io/OpenSeesDocumentation/)
- [PyNite](https://github.com/JWock82/Pynite)
- [XC FEM](https://github.com/xcfem/xc)
- [JAX-FEM](https://github.com/deepmodeling/jax-fem)
- [PyDy](https://pydy.org/)
- [CalculiX](https://www.calculix.de/)
- [Code_Aster](https://code-aster-windows.com/) | [Docker](https://github.com/scimulate/code_aster)
- [MFEM](https://mfem.org/) | [GitHub](https://github.com/mfem/mfem)
- [deal.II](https://dealii.org/)
- [Elmer FEM](https://www.elmerfem.org/) | [GitHub](https://github.com/ElmerCSC/elmerfem)
- [FreeFEM](https://freefem.org/)
- [OOFEM](https://www.oofem.org/) | [GitHub](https://github.com/Micket/oofem)
- [Sparselizard](https://www.sparselizard.org/) | [GitHub](https://github.com/halbux/sparselizard)
- [GetFEM](https://getfem.org/)
- [PolyFEM](https://polyfem.github.io/) | [GitHub](https://github.com/polyfem/polyfem)
- [GooseFEM](https://github.com/tdegeus/GooseFEM)
- [Rapier Physics](https://rapier.rs/) | [rapier.js](https://github.com/dimforge/rapier.js)
- [cannon-es](https://pmndrs.github.io/cannon-es/)
- [Ammo.js](https://github.com/nicedozie4u/ammo.js)
- [Verlet.js](https://github.com/subprotocol/verlet-js)
- [VerletExpressJS](https://github.com/matthewmain/VerletExpressJS)
- [triangle-wasm](https://github.com/brunoimbrizi/triangle-wasm)
- [Gmsh](https://gmsh.info/)
- [SPARSELAB](https://sparselab.com/)
- [SkyCiv](https://skyciv.com/)
- [WeStatiX](https://westatix.com/)
- [SimScale](https://www.simscale.com/)
- [CAEplex](https://www.caeplex.com/)
- [RodX](https://rodxcalc.com/)
- [CalcForge](https://calcforge.com/)
- [Project Atlantis TetheredRing](https://github.com/philipswan/TetheredRing)
- [Catenary FEA Course](https://www.engineeringskills.com/course/non-linear-finite-element-analysis-of-2d-catenary-and-cable-structures)
- [Emscripten](https://emscripten.org/)
- [WebAssembly 3.0](https://webassembly.org/news/2025-09-17-wasm-3.0/)
- [Eigen via Observable/WASM](https://observablehq.com/@rreusser/eigen)
- [Orekit](https://www.orekit.org/)
