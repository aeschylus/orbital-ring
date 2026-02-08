# Three.js + XState Patterns for Engineering Simulation in Next.js

## Sources
- [React Three Fiber vs. Three.js in 2026 (Graffersid)](https://graffersid.com/react-three-fiber-vs-three-js/)
- [pmndrs/react-three-next starter (GitHub)](https://github.com/pmndrs/react-three-next)
- [R3F Scaling Performance docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [XState v5 announcement (Stately)](https://stately.ai/blog/2023-12-01-xstate-v5)
- [XState + Next.js global state (Brad Woods)](https://garden.bradwoods.io/notes/javascript/state-management/xstate/global-state)
- [Opinionated XState + Next.js App Router (Adam Madojemu)](https://www.adammadojemu.com/blog/opinionated-approach-xstate-with-next-js-app-router-rsc)
- [XState React docs (@xstate/react)](https://stately.ai/docs/xstate-react)
- [Three.js LOD docs](https://threejs.org/docs/#api/en/objects/LOD)
- [Instanced Rendering of Parameterized 3D Glyphs (ACM)](https://dl.acm.org/doi/10.1145/3665318.3677171)
- [Drei Instances docs](https://drei.docs.pmnd.rs/performances/instances)
- [Three.js floating point precision (forum)](https://discourse.threejs.org/t/large-coordinates/50621)
- [High-Precision Rendering in Global Scenes (Re:Earth)](https://reearth.engineering/posts/high-precision-rendering-en/)
- [r3f-perf performance monitor (GitHub)](https://github.com/utsuboco/r3f-perf)
- [TSL: Three Shading Language (Three.js Roadmap)](https://threejsroadmap.com/blog/tsl-a-better-way-to-write-shaders-in-threejs)
- [React Three Fiber with WebGPU and TSL (Pragmattic)](https://blog.pragmattic.dev/react-three-fiber-webgpu-typescript)
- [@react-three/offscreen (GitHub)](https://github.com/pmndrs/react-three-offscreen)
- [100 Three.js Tips (2026)](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [WebGL-Orbiter (GitHub)](https://github.com/msakuta/WebGL-Orbiter)
- [jsOrrery Solar System Simulator (GitHub)](https://github.com/mgvez/jsorrery)
- [Orbital mechanics game devlog (Gianluca.ai)](https://gianluca.ai/orbital-devlog/)
- [Leva GUI library (GitHub)](https://github.com/pmndrs/leva)
- [CesiumJS (cesium.com)](https://cesium.com/platform/cesiumjs/)
- [Resium (React + Cesium)](https://resium.reearth.io/components/Globe)
- [react-globe.gl (GitHub)](https://github.com/vasturiano/react-globe.gl)
- [XState Actors docs](https://stately.ai/docs/actors)
- [XState Invoke docs](https://stately.ai/docs/invoke)
- [Field Guide to TSL and WebGPU (Maxime Heckel)](https://blog.maximeheckel.com/posts/field-guide-to-tsl-and-webgpu/)
- [Bloom - React Postprocessing docs](https://react-postprocessing.docs.pmnd.rs/effects/bloom)
- [Project Atlantis Tethered Ring simulation](https://www.project-atlantis.com/wp-content/threejs-simulation/TetheredRing/)

---

## 1. Three.js in Next.js: Architectural Patterns

### 1.1 React Three Fiber (R3F) vs Raw Three.js

**Recommendation: Use React Three Fiber (R3F)** for the orbital ring simulation.

| Aspect | Raw Three.js | React Three Fiber |
|--------|-------------|-------------------|
| Rendering model | Imperative | Declarative (JSX) |
| Component reuse | Manual | React component model |
| State management | Manual | Hooks, context, XState |
| Ecosystem | Mature, huge | Growing fast (drei, postprocessing, etc.) |
| Performance ceiling | Slightly higher | Negligible overhead (~5%) |
| SSR compatibility | Manual handling | Solved patterns exist |
| Learning curve | Three.js only | Three.js + React concepts |

**Why R3F for this project:**
- The orbital ring simulation requires complex UI alongside the 3D scene (parameter panels, simulation controls, data readouts). R3F lets these coexist naturally in the React component tree.
- Drei provides battle-tested abstractions for LOD (`<Detailed />`), instancing (`<Instances />`), and camera controls (`<OrbitControls />`).
- The component model maps well to the physical hierarchy: Earth > Ring > Tethers > Stations > Shuttles.
- R3F v9 (RC) supports React 19 and Next.js 15, meaning we can use the latest framework features.

**Where raw Three.js still matters:**
- Custom shaders for the ring's electromagnetic visualization
- GPU-driven particle systems for atmospheric effects
- Performance-critical inner loops in `useFrame` callbacks (these still call raw Three.js methods)

### 1.2 Server-Side Rendering Considerations

Three.js requires WebGL/WebGPU, which only exists in the browser. The key patterns for Next.js App Router:

**Pattern 1: Client Component Boundary**
```tsx
// components/SimulationCanvas.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

export default function SimulationCanvas() {
  return (
    <Canvas
      gl={{ logarithmicDepthBuffer: true }}
      camera={{ near: 0.1, far: 1e8 }}
    >
      <Suspense fallback={null}>
        <OrbitalRingScene />
      </Suspense>
    </Canvas>
  );
}
```

**Pattern 2: Dynamic Import with SSR Disabled (Preferred for heavy scenes)**
```tsx
// app/simulation/page.tsx (Server Component)
import dynamic from 'next/dynamic';

const SimulationCanvas = dynamic(
  () => import('@/components/SimulationCanvas'),
  { ssr: false }
);

export default function SimulationPage() {
  return (
    <div className="h-screen w-screen">
      <SimulationCanvas />
    </div>
  );
}
```

**Pattern 3: react-three-next Architecture**
The `pmndrs/react-three-next` starter provides a reference architecture:
- `/app` directory with App Router
- `/src/components/canvas/` for 3D components
- `/src/components/dom/` for 2D overlay UI
- Shared layout wrapping both Canvas and DOM layers
- Automatic SSR avoidance for Canvas components

**Key rules:**
1. Never import Three.js or R3F in Server Components
2. Always use `'use client'` at the top of any file using `<Canvas>`
3. Use `dynamic(() => import(...), { ssr: false })` for the top-level canvas wrapper
4. Keep page-level metadata and data fetching in Server Components; pass data down as props

### 1.3 Performance Optimization for Scientific Visualization

#### Draw Call Management
Each mesh equals one draw call. Target: fewer than 300 draw calls for 60fps on mid-range hardware.

- **Instancing** for repeating elements (tethers, stations, ring segments): reduces thousands of draw calls to one
- **Geometry merging** for static scenery using `BufferGeometryUtils.mergeGeometries()`
- **Material sharing**: reuse materials across meshes with the same visual properties

#### The useFrame Discipline
```tsx
// GOOD: mutate refs directly in useFrame
const meshRef = useRef<THREE.Mesh>(null!);
useFrame((state, delta) => {
  meshRef.current.rotation.y += delta * rotationSpeed;
});

// BAD: setting React state in the render loop
useFrame(() => {
  setRotation(prev => prev + 0.01); // triggers re-render every frame!
});
```

**Rule: Never call React setState inside useFrame.** All per-frame mutations must happen via refs and direct Three.js object manipulation.

#### Geometry Budget
For 60fps on a modern GPU:
- Total triangles: keep under 2-5 million for WebGL, potentially more with WebGPU
- Vertices per object: use LOD to keep visible vertex count under 1M
- Textures: compress with KTX2/Basis Universal; total VRAM target under 512MB

#### On-Demand Rendering
For a simulation with a pause state, avoid rendering when nothing changes:
```tsx
<Canvas frameloop="demand">
  {/* Scene will only re-render when invalidate() is called */}
</Canvas>

// In a component:
useFrame(({ invalidate }) => {
  if (simulationRunning) {
    updateSimulation(delta);
    invalidate(); // request a new frame
  }
});
```

### 1.4 Large-Scale Scene Management (Earth-Scale)

The orbital ring spans ~40,000 km. A tether is ~32 km (Tethered Ring) or ~300-600 km (classic orbital ring). A station might be 50m across. This is a scale range of roughly 10^6.

#### Floating-Point Precision Problem

WebGL uses 32-bit floats. At Earth scale (radius ~6,371 km = 6,371,000 m), objects at coordinates like `(6371000, 0, 0)` lose precision below ~0.5 meters. Jitter ("the shakes") appears when the camera is near small objects at large coordinates.

**Solution 1: Camera-Relative Rendering (Recommended)**
Keep the scene origin at the camera position. Translate the world, not the camera.
```tsx
useFrame(({ camera }) => {
  // Move the entire world so camera stays at origin
  worldGroup.current.position.set(
    -camera.position.x,
    -camera.position.y,
    -camera.position.z
  );
  camera.position.set(0, 0, 0);
});
```

**Solution 2: Relative-to-Center (RTC) for Tiles/Segments**
Subdivide the ring into segments. Each segment's geometry is defined relative to its own center. The segment center is held in the mesh's model matrix (float64 in JS, converted at the last moment). Vertices stay small, preserving float32 precision on the GPU.

**Solution 3: High/Low Float Splitting (Cesium's approach)**
Split each vertex position into high and low float32 components from float64 precision. In the vertex shader:
```glsl
vec3 position_relative = (position_high - camera_high) + (position_low - camera_low);
```
This is the technique CesiumJS uses for global-scale rendering.

**Solution 4: Logarithmic Depth Buffer**
```tsx
<Canvas gl={{ logarithmicDepthBuffer: true }}>
```
Solves z-fighting at large distances but adds a small per-fragment cost. Essential for scenes spanning 0.1m to 100,000km. Be aware: some post-processing effects (depth of field, SSAO) may not work correctly with logarithmic depth.

**Recommended approach for the orbital ring project:** Combine camera-relative rendering + RTC segments + logarithmic depth buffer. This three-pronged strategy handles precision at all scales.

#### Scale Factor Strategy
An alternative to true-scale rendering: define a scale factor.
- 1 unit = 1 km: Earth radius = 6,371 units. Ring at altitude 32 km = radius 6,403 units. Still large enough for precision issues at close zoom.
- 1 unit = 10 km: Earth = 637 units. Good for overview. Switch to a detail scene for close inspection.
- **Multi-scale approach**: Overview scene (1 unit = 100 km, Earth = 64 units) for the full ring + detail scene (1 unit = 1 m) for station/tether close-ups. Transition between them.

### 1.5 LOD (Level of Detail) Strategies

#### Drei's `<Detailed />` Component
```tsx
import { Detailed } from '@react-three/drei';

function RingSegment({ position }) {
  return (
    <Detailed distances={[0, 50, 200]}>
      {/* Close: high detail, 10k triangles */}
      <RingSegmentHigh />
      {/* Medium: 2k triangles */}
      <RingSegmentMed />
      {/* Far: 200 triangles */}
      <RingSegmentLow />
    </Detailed>
  );
}
```

#### Custom LOD for the Orbital Ring
The ring has unique LOD requirements:
1. **Far away**: Render as a single textured torus or even a line/shader effect
2. **Medium distance**: Show ring structure, tether attachment points as dots
3. **Close up**: Full structural detail, individual tethers, stations, shuttle bays
4. **Very close**: Interior detail of stations, mechanical components

```
Distance (km) | Ring LOD         | Tethers          | Stations
>10,000       | Shader line/glow | Hidden           | Hidden
1,000-10,000  | Low-poly torus   | Lines            | Dots/sprites
100-1,000     | Segmented mesh   | Thin cylinders   | Low-poly
10-100        | Detailed mesh    | Full geometry    | Medium detail
<10           | Section detail   | Structural detail| Full detail
```

#### LOD for Earth
- **Far**: Simple sphere with texture + atmosphere shader
- **Medium**: Higher-resolution texture, cloud layer, bump mapping
- **Close**: Terrain tiles loaded on demand (like Cesium's quadtree)

### 1.6 Instanced Rendering for Repeating Elements

The orbital ring has many repeating elements: tethers (potentially thousands), ring segments, anchor points, transit stations, solar panels.

#### Drei's `<Instances />` API
```tsx
import { Instances, Instance } from '@react-three/drei';

function Tethers({ tethersData }) {
  return (
    <Instances limit={10000}>
      <cylinderGeometry args={[0.5, 0.5, 32, 8]} />
      <meshStandardMaterial color="#888" />
      {tethersData.map((tether, i) => (
        <Instance
          key={i}
          position={tether.position}
          rotation={tether.rotation}
          scale={tether.scale}
        />
      ))}
    </Instances>
  );
}
```

#### Raw InstancedMesh for Maximum Performance
When instance count exceeds ~10,000 or positions need GPU-driven updates:
```tsx
function MassiveTethers({ count }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(/* computed position */);
      dummy.lookAt(/* earth center */);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <cylinderGeometry args={[0.1, 0.1, 1, 6]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
}
```

#### GPU-Driven Instancing (for 100k+ elements)
For very high counts, drive instance positions in the vertex shader using data textures:
```tsx
// Store positions in a Float32Array -> DataTexture
// Sample in vertex shader to position each instance
// No JS per-instance overhead
```

---

## 2. XState Patterns for Simulation

### 2.1 XState v5 with Next.js

XState v5 centers on the **actor model**: state machines are actors, and actors communicate via events.

**Installation:**
```bash
npm install xstate @xstate/react
```

**Key change from v4 to v5:**
- `createMachine` replaced by `setup({}).createMachine({})`
- Actions, guards, and actors are defined in `setup()` for type safety
- `interpret()` replaced by `createActor()`
- Services renamed to actors
- Actor persistence built in

**Next.js App Router Integration Pattern:**
```tsx
// machines/simulationMachine.ts
import { setup, assign, fromCallback } from 'xstate';

export const simulationMachine = setup({
  types: {} as {
    context: SimulationContext;
    events: SimulationEvents;
  },
  actions: { /* ... */ },
  guards: { /* ... */ },
  actors: { /* ... */ },
}).createMachine({
  id: 'simulation',
  // ... machine definition
});
```

```tsx
// providers/SimulationProvider.tsx
'use client';

import { createActorContext } from '@xstate/react';
import { simulationMachine } from '@/machines/simulationMachine';

export const SimulationContext = createActorContext(simulationMachine);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  return (
    <SimulationContext.Provider>
      {children}
    </SimulationContext.Provider>
  );
}
```

```tsx
// app/simulation/layout.tsx
import { SimulationProvider } from '@/providers/SimulationProvider';

export default function SimulationLayout({ children }) {
  return <SimulationProvider>{children}</SimulationProvider>;
}
```

```tsx
// Any client component can consume the machine:
'use client';

import { SimulationContext } from '@/providers/SimulationProvider';

function PlayPauseButton() {
  const actorRef = SimulationContext.useActorRef();
  const isPaused = SimulationContext.useSelector(
    (state) => state.matches('paused')
  );

  return (
    <button onClick={() => actorRef.send({ type: isPaused ? 'PLAY' : 'PAUSE' })}>
      {isPaused ? 'Play' : 'Pause'}
    </button>
  );
}
```

### 2.2 State Machine for Simulation Control

```
                    +-----------+
                    |  loading  |
                    +-----+-----+
                          | LOADED
                          v
           +------>  +---------+  <------+
           |         |  idle   |         |
           |         +----+----+         |
           |              | PLAY         |
           |              v              |
           |         +---------+         |
     RESET |         | running |   PAUSE |
           |         +----+----+         |
           |              |              |
           |         PAUSE|    +---------+
           |              v    |
           |         +---------+
           +-------- | paused  |
                     +----+----+
                          | STEP
                          v
                    +-----------+
                    | stepping  |---> back to paused
                    +-----------+
```

**Full Machine Definition:**
```tsx
import { setup, assign, fromCallback } from 'xstate';

interface SimulationContext {
  time: number;           // simulation time in seconds
  timeStep: number;       // delta per step (e.g., 0.016 for 60fps equiv)
  speed: number;          // time multiplier (1x, 10x, 100x)
  maxTime: number;        // optional simulation end time
  frameCount: number;
  parameters: SimulationParameters;
}

type SimulationEvents =
  | { type: 'LOADED' }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STEP' }
  | { type: 'RESET' }
  | { type: 'TICK'; delta: number }
  | { type: 'SET_SPEED'; speed: number }
  | { type: 'SET_PARAMETER'; key: string; value: number };

export const simulationMachine = setup({
  types: {} as {
    context: SimulationContext;
    events: SimulationEvents;
  },
  actors: {
    ticker: fromCallback(({ sendBack, receive }) => {
      let animFrameId: number;
      let lastTime = performance.now();
      let running = true;

      receive((event) => {
        if (event.type === 'STOP') running = false;
      });

      const tick = (now: number) => {
        if (!running) return;
        const delta = (now - lastTime) / 1000;
        lastTime = now;
        sendBack({ type: 'TICK', delta });
        animFrameId = requestAnimationFrame(tick);
      };

      animFrameId = requestAnimationFrame(tick);

      return () => {
        running = false;
        cancelAnimationFrame(animFrameId);
      };
    }),
  },
  actions: {
    advanceTime: assign(({ context, event }) => {
      if (event.type !== 'TICK') return {};
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
      if (event.type !== 'SET_SPEED') return {};
      return { speed: event.speed };
    }),
    setParameter: assign(({ context, event }) => {
      if (event.type !== 'SET_PARAMETER') return {};
      return {
        parameters: {
          ...context.parameters,
          [event.key]: event.value,
        },
      };
    }),
  },
}).createMachine({
  id: 'simulation',
  initial: 'loading',
  context: {
    time: 0,
    timeStep: 1 / 60,
    speed: 1,
    maxTime: Infinity,
    frameCount: 0,
    parameters: { /* defaults */ },
  },
  on: {
    SET_SPEED: { actions: 'setSpeed' },
    SET_PARAMETER: { actions: 'setParameter' },
  },
  states: {
    loading: {
      on: { LOADED: 'idle' },
    },
    idle: {
      on: { PLAY: 'running' },
    },
    running: {
      invoke: {
        src: 'ticker',
        id: 'ticker',
      },
      on: {
        TICK: { actions: 'advanceTime' },
        PAUSE: 'paused',
        RESET: { target: 'idle', actions: 'resetTime' },
      },
    },
    paused: {
      on: {
        PLAY: 'running',
        STEP: { actions: 'stepOnce' },
        RESET: { target: 'idle', actions: 'resetTime' },
      },
    },
  },
});
```

### 2.3 XState for Managing Simulation Parameters

Use **parallel states** for independent parameter groups:

```tsx
const parameterMachine = setup({ /* ... */ }).createMachine({
  id: 'parameters',
  type: 'parallel',
  states: {
    ringConfig: {
      initial: 'default',
      context: {
        altitude: 32,        // km
        circumference: 32000, // km
        tetherCount: 1000,
        ringMass: 1e8,        // kg
      },
      states: {
        default: {},
        custom: {},
      },
    },
    physicsConfig: {
      initial: 'newtonian',
      context: {
        gravityModel: 'spherical',
        atmosphericDrag: true,
        windForces: true,
      },
      states: {
        newtonian: {},
        simplified: {},
      },
    },
    visualConfig: {
      initial: 'standard',
      context: {
        showForceVectors: false,
        showStressMap: false,
        showAtmosphere: true,
        colorScheme: 'physical',
      },
      states: {
        standard: {},
        analysis: {},
        presentation: {},
      },
    },
  },
});
```

### 2.4 XState + Three.js Integration Patterns

**Pattern: Bridging XState State to useFrame**

The simulation machine manages discrete states (play/pause/step). The R3F render loop (`useFrame`) needs continuous per-frame data. Bridge them with a ref:

```tsx
function SimulationBridge() {
  const actorRef = SimulationContext.useActorRef();
  const simTime = SimulationContext.useSelector((s) => s.context.time);
  const isRunning = SimulationContext.useSelector((s) => s.matches('running'));

  // Store simulation state in a ref for useFrame access (no re-renders)
  const simState = useRef({ time: 0, running: false });

  useEffect(() => {
    simState.current.time = simTime;
    simState.current.running = isRunning;
  }, [simTime, isRunning]);

  useFrame((_, delta) => {
    if (simState.current.running) {
      // Update 3D objects based on simulation time
      updateRingPosition(simState.current.time);
      updateTetherTensions(simState.current.time);
      updateShuttlePositions(simState.current.time);
    }
  });

  return null; // This component only bridges state; renders nothing
}
```

**Pattern: Actor Hierarchy for Complex Simulations**

Use spawned actors for independent subsystems:

```
simulationMachine (root)
  |-- ringPhysicsActor      (structural dynamics)
  |-- atmosphereActor        (weather model)
  |-- transitActor           (shuttle scheduling)
  |-- cameraControlActor     (view management)
  |-- uiActor                (panel states)
```

Each actor has its own state machine, communicates via events. The root simulation machine coordinates them.

**Pattern: Two-Loop Architecture**

Separate the physics simulation loop from the rendering loop:

```
XState ticker (fromCallback)          R3F useFrame
  |                                      |
  | TICK events -> update physics        | reads physics state
  | (can run at fixed timestep)          | (interpolates for smooth rendering)
  | (can run faster than 60fps)          | (always at display refresh rate)
```

This decoupling means physics can run at 120Hz or 240Hz for accuracy while rendering stays at 60fps. The render loop interpolates between physics states for smooth visuals.

### 2.5 State Machines for Complex UI Workflows

**Camera Mode Machine:**
```tsx
const cameraMachine = setup({}).createMachine({
  id: 'camera',
  initial: 'orbit',
  states: {
    orbit: {
      on: {
        FLY_TO: 'flyingTo',
        FOLLOW: 'following',
        FREE: 'free',
      },
    },
    flyingTo: {
      // Animate camera to target, then settle
      on: {
        ARRIVED: 'orbit',
        CANCEL: 'orbit',
      },
    },
    following: {
      // Track a moving object (shuttle, station)
      on: {
        RELEASE: 'orbit',
        FLY_TO: 'flyingTo',
      },
    },
    free: {
      on: {
        ORBIT: 'orbit',
        FOLLOW: 'following',
      },
    },
  },
});
```

**Panel/Workflow Machine:**
```tsx
const analysisMachine = setup({}).createMachine({
  id: 'analysis',
  initial: 'overview',
  states: {
    overview: {
      on: {
        SELECT_SEGMENT: 'segmentDetail',
        SELECT_TETHER: 'tetherDetail',
        OPEN_PARAMETERS: 'parameterEditor',
      },
    },
    segmentDetail: {
      initial: 'stress',
      states: {
        stress: {},
        thermal: {},
        dynamics: {},
      },
      on: { BACK: 'overview' },
    },
    tetherDetail: {
      initial: 'tension',
      states: {
        tension: {},
        oscillation: {},
        material: {},
      },
      on: { BACK: 'overview' },
    },
    parameterEditor: {
      on: {
        APPLY: 'overview',
        CANCEL: 'overview',
      },
    },
  },
});
```

---

## 3. Similar Existing Projects

### 3.1 Orbital Mechanics Visualizers (Three.js)

| Project | Tech Stack | Key Features | Relevance |
|---------|-----------|--------------|-----------|
| [WebGL-Orbiter](https://github.com/msakuta/WebGL-Orbiter) | Three.js, JS | Real-scale solar system, Newtonian dynamics, speed control (1x to 1Mx) | Speed control patterns, large-scale coordinates |
| [jsOrrery](https://github.com/mgvez/jsorrery) | Three.js, WebGL | Accurate planetary positions from JPL Horizons, date-based ephemerides | Astronomical data integration, orbit path rendering |
| [Orbital (Gianluca)](https://github.com/gianlucatruda/orbital) | Three.js, Rust/WASM | Physics in Rust compiled to WASM, Three.js rendering | WASM for physics, JS for rendering pattern |
| [Planetarium.earth](https://planetarium.earth/) | Three.js | Solar system dynamics, educational visualization | UX patterns for space education tools |

**Key takeaways from these projects:**
- All use some form of time scaling (speed control widget)
- Large-scale coordinate handling is a universal challenge
- Physics often separated from rendering (different loops/languages)
- Trail rendering for orbital paths is a common visual element

### 3.2 Project Atlantis Tethered Ring Simulation

The [Project Atlantis Three.js simulation](https://www.project-atlantis.com/wp-content/threejs-simulation/TetheredRing/) is the closest existing reference to our project.

**Technology:**
- Raw Three.js (not R3F)
- Custom GLSL shaders for planet atmosphere, ring structure
- Vertex/fragment shader for atmospheric glow (blue haze effect)
- Edge detection shaders for the ring with front/back face differentiation

**Visual approach:**
- Planet texture with normal maps for terrain
- Atmospheric halo using intensity-based glow
- Ring rendered with thickness parameters and edge detection
- Front faces rendered lighter, back faces darker for depth

**What we can improve upon:**
- Use R3F for better component architecture and UI integration
- Add XState-driven simulation controls (play/pause/step)
- Add interactivity: click tethers, zoom to stations
- Add engineering data overlays (stress, tension, thermal)
- Use instancing for repeating elements (their approach likely uses individual meshes)
- Add LOD for multi-scale viewing

### 3.3 Engineering/Scientific Visualization Platforms

| Platform | Stack | Relevance |
|----------|-------|-----------|
| CesiumJS | WebGL, custom | Gold standard for Earth-scale rendering. Precision techniques (RTC, high/low floats) directly applicable. |
| [react-globe.gl](https://github.com/vasturiano/react-globe.gl) | Three.js, React | React component for globe rendering with data overlays. Architecture patterns for globe + data. |
| Resium | React + CesiumJS | Declarative React wrappers for Cesium. Shows how to bridge imperative geo-rendering with React. |
| MDPI "Modern Scientific Visualizations on the Web" | Survey | Academic survey of web-based sci-viz. Covers WebGL patterns, data streaming, interaction. |

---

## 4. Key Libraries and Their Roles

### 4.1 Core Rendering Stack

| Package | Version | Role |
|---------|---------|------|
| `three` | ^0.170+ | 3D engine. Use latest for WebGPU/TSL support. |
| `@react-three/fiber` | v9 RC | React renderer for Three.js. Required for Next.js 15 / React 19. |
| `@react-three/drei` | latest | Utility components: `<Detailed />` (LOD), `<Instances />`, `<OrbitControls />`, `<Html />` (DOM overlays in 3D), `<PerformanceMonitor />`, `<AdaptiveDpr />`. |
| `@react-three/postprocessing` | latest | Post-processing effects: bloom/glow for the ring, selective bloom for status indicators, tone mapping for HDR. |
| `@react-three/offscreen` | latest | Offscreen canvas rendering in a Web Worker. Frees main thread for UI. Note: not supported in Safari yet. |

### 4.2 State Management

| Package | Version | Role |
|---------|---------|------|
| `xstate` | ^5.x | State machines and actors. Simulation control, UI workflows, camera modes. |
| `@xstate/react` | ^4.x | React bindings. `createActorContext`, `useSelector`, `useActorRef`. |

### 4.3 Globe and Geospatial (Evaluate)

| Package | Pros | Cons | Recommendation |
|---------|------|------|----------------|
| `three-globe` | Lightweight, pure Three.js, easy to integrate with R3F | Limited terrain detail, no built-in precision handling | Good for overview/context view |
| `cesium` / `resium` | Gold standard Earth rendering, sub-meter precision, terrain streaming, WGS84 | Heavy (~40MB), own rendering pipeline (not Three.js), hard to mix with custom Three.js scenes | Consider for a dedicated "Earth detail" view but not the primary renderer |
| `react-globe.gl` | React component, arc/point/polygon overlays | Lower fidelity than Cesium, less control | Quick prototyping |

**Recommendation:** Use Three.js with a custom Earth implementation for the primary simulation view. Borrow precision techniques from CesiumJS (RTC, logarithmic depth). Consider `three-globe` for a lightweight overview mode.

### 4.4 UI and Controls

| Package | Role | Notes |
|---------|------|-------|
| `leva` | Parameter GUI panels | React-first, integrates perfectly with R3F. Supports numbers, booleans, vectors, colors, folders. ~80k weekly downloads. Use for engineering parameter tuning. |
| `r3f-perf` | Performance monitoring | Shows FPS, GPU time, draw calls, triangles, textures, shaders. Essential during development. |
| `stats-gl` | Lightweight FPS/CPU/GPU | Alternative to r3f-perf if you need less overhead. |
| `@react-three/drei` `<Stats />` | Basic FPS counter | Quick stats.js integration. |

### 4.5 Future-Proofing: WebGPU and TSL

As of late 2025, WebGPU is supported in all major browsers (Chrome, Firefox, Safari 26+).

**Three.js WebGPU support:**
- `WebGPURenderer` available since r171 via `import { WebGPURenderer } from 'three/webgpu'`
- Automatic WebGL 2 fallback
- Requires async initialization: `await renderer.init()`

**TSL (Three Shading Language):**
- Node-based material system: write once, runs on both WebGL and WebGPU
- Properties like `positionNode`, `colorNode`, `normalNode` for programmatic shader control
- The future of Three.js shading; raw GLSL still works but TSL is recommended for new projects

**R3F + WebGPU:**
- R3F v9 supports WebGPU via configuration
- TSL node materials work within R3F's declarative model

**Recommendation for the orbital ring project:** Start with WebGL (wider compatibility). Design shaders using TSL where possible for future WebGPU migration. The computational intensity of the orbital ring simulation (atmospheric effects, stress visualization, large instanced scenes) will benefit significantly from WebGPU compute shaders when the ecosystem matures.

### 4.6 Computation Offloading

For physics-heavy simulation:

| Approach | Use Case | Notes |
|----------|----------|-------|
| Web Workers | Physics stepping, force calculations | Can run at higher frequency than render loop. Use `SharedArrayBuffer` for zero-copy data sharing with render thread. |
| WASM (Rust/C++) | Orbital mechanics, structural analysis | 10-100x faster than JS for numerical computation. Several orbital sim projects use Rust->WASM successfully. |
| `@react-three/offscreen` | Move entire render to worker | Frees main thread completely. Good for self-contained 3D views. |
| GPU Compute (WebGPU) | Particle systems, force field calculations | Future option. TSL compute shaders could handle per-tether force calculations on GPU. |

---

## 5. Recommended Architecture for the Orbital Ring Simulation

### 5.1 Project Structure
```
orbital-ring/
  app/
    layout.tsx              # Root layout (Server Component)
    page.tsx                # Landing page
    simulation/
      layout.tsx            # Wraps SimulationProvider (Client)
      page.tsx              # Dynamic import of SimulationCanvas
      loading.tsx           # Loading state while canvas initializes
  components/
    canvas/                 # 3D components (all 'use client')
      SimulationCanvas.tsx  # Top-level <Canvas> with config
      Earth.tsx             # Earth sphere + atmosphere
      OrbitalRing.tsx       # Ring segments (instanced)
      Tethers.tsx           # Tethers (instanced)
      Stations.tsx          # Transit stations
      ForceVectors.tsx      # Debug/analysis overlays
      AtmosphereShader.tsx  # Custom shader for atmosphere
      SimulationBridge.tsx  # XState -> useFrame bridge
    dom/                    # 2D overlay components
      ControlPanel.tsx      # Play/pause/step/reset
      ParameterPanel.tsx    # Leva-powered parameter editor
      DataReadout.tsx       # Real-time simulation data
      TimelineBar.tsx       # Simulation time scrubber
  machines/
    simulationMachine.ts    # Root simulation state machine
    cameraMachine.ts        # Camera mode management
    analysisMachine.ts      # UI panel workflows
    parameterMachine.ts     # Parameter validation/presets
  providers/
    SimulationProvider.tsx  # createActorContext wrapper
  lib/
    physics/               # Physics computation (potential WASM target)
      orbitalMechanics.ts
      structuralAnalysis.ts
      atmospheric.ts
    constants.ts           # Physical constants, scale factors
    types.ts               # Shared TypeScript types
  workers/
    physicsWorker.ts       # Web Worker for physics stepping
  public/
    textures/              # Earth textures, ring materials
    models/                # Station/shuttle GLTF models
```

### 5.2 Data Flow
```
User Input (UI events)
  |
  v
XState Machine (simulationMachine)
  |
  |-- sends TICK events ---> Physics Worker (Web Worker)
  |                             |
  |                             v
  |                         Computes forces, positions
  |                             |
  |<--- physics results --------+
  |
  v
XState Context (time, positions, forces)
  |
  v
SimulationBridge (reads XState via useSelector, writes to refs)
  |
  v
useFrame (reads refs, updates Three.js objects directly)
  |
  v
Three.js Renderer (WebGL / WebGPU)
```

### 5.3 Key Integration Points

1. **XState manages "what" and "when"**: What state is the simulation in? What parameters are set? When do transitions happen?
2. **R3F manages "how"**: How are things rendered? How are objects positioned? How does the camera move?
3. **The bridge pattern** (`SimulationBridge` component) translates between event-driven XState world and frame-driven Three.js world.
4. **Leva provides rapid parameter iteration** during development, can be swapped for a production UI panel later.
5. **r3f-perf monitors performance** to catch regressions as scene complexity grows.

### 5.4 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| FPS | 60fps (overview), 30fps minimum (detail) | LOD, instancing, on-demand rendering when paused |
| Draw calls | < 200 | Instancing for tethers/segments, material sharing |
| Load time | < 3s to first render | Code splitting, progressive loading, texture compression |
| Memory | < 1GB GPU VRAM | LOD, texture streaming, dispose unused |
| Physics update | 120Hz+ | Web Worker, fixed timestep, potential WASM |

---

## 6. Open Questions and Decisions Needed

1. **Scale model**: Should the primary view be true-scale (with camera-relative rendering) or use a compressed scale for artistic clarity?
2. **Cesium integration**: Is it worth the complexity to embed a Cesium view for high-fidelity Earth terrain, or is a custom Three.js Earth sufficient?
3. **WebGPU timeline**: Should we target WebGPU from the start (with WebGL fallback) or start pure WebGL and migrate later?
4. **Physics engine**: Pure JS/TS, or invest in Rust->WASM for the physics core from the beginning?
5. **Offline computation**: Should complex analysis (structural modes, thermal equilibrium) be pre-computed server-side and streamed, or computed client-side?
6. **Mobile support**: What level of mobile/tablet support is needed? This significantly affects polygon budgets and LOD strategy.
