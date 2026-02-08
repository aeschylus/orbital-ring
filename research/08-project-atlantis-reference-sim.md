# Project Atlantis Reference Simulation

## URL
https://www.project-atlantis.com/wp-content/threejs-simulation/TetheredRing/

## Tech Stack
- Raw Three.js (not React Three Fiber)
- Custom GLSL vertex + fragment shaders
- WebGL rendering

## What It Visualizes
- Planet with atmospheric glow effect
- Tethered ring structure orbiting
- Wireframe-style ring geometry with barycentric coordinate edge detection

## Shader Details
- Atmosphere intensity: `1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0))`
- Atmosphere color: `vec3(0.3, 0.6, 1.0)` (cyan-blue)
- Ring: barycentric coordinates for edge detection
- Inverted color variants available

## Available Downloads
- KML file (geographic/spatial data)
- Specifications file

## Lessons for Our Implementation
- They use raw Three.js — we'll use React Three Fiber for better Next.js integration
- Custom shaders for atmosphere are a pattern we should adopt
- KML data suggests they work with real geographic coordinates
- No visible physics simulation in frontend — likely pre-computed or server-side
