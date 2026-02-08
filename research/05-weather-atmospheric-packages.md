# Weather & Atmospheric Simulation Packages

## Context

The tethered ring concept (Project Atlantis) operates at **32 km altitude** in the stratosphere. The classic orbital ring variant operates at **300-600 km** in LEO. A simulation needs atmospheric data, wind modeling, density profiles, and visualization across this full range. This document evaluates open-source packages and data sources organized by category.

---

## 1. JavaScript/TypeScript Weather Visualization & Simulation

### 1.1 Fluid Earth

- **URL**: https://github.com/byrd-polar/fluid-earth
- **License**: MIT
- **Language**: JavaScript (WebGL)
- **Capabilities**: WebGL-powered visualization of Earth's atmosphere and oceans. Overlays color-coded weather bitmaps and animated wind/ocean-current streamlines on a 3D globe. Developed by Byrd Polar and Climate Research Center at Ohio State.
- **Data Sources**: Pulls from GFS, GEOS, ERA5, and other reanalysis datasets.
- **Web Feasibility**: Runs entirely in browser. Mobile-friendly. Strong reference for globe-based atmospheric rendering.
- **Tethered Ring Relevance**: HIGH. Provides a working open-source model for global wind visualization on a 3D globe. Could serve as a starting point for overlaying ring geometry onto real wind data. However, it is primarily a 2D surface visualization projected onto a globe -- it does not natively show altitude-varying data or vertical wind profiles.

### 1.2 cambecc/earth (earth.nullschool.net base)

- **URL**: https://github.com/cambecc/earth
- **License**: MIT
- **Language**: JavaScript, D3.js, Canvas
- **Capabilities**: The original open-source project behind earth.nullschool.net. Visualizes global weather conditions from GFS data using animated wind particles on an orthographic globe projection. Uses Canvas 2D (not WebGL) for rendering wind streamlines.
- **Data Sources**: GFS forecasts from NOAA, produced 4x daily.
- **Web Feasibility**: Pure browser JS. Lightweight. Well-understood codebase.
- **Tethered Ring Relevance**: MODERATE. Good reference architecture for wind particle animation techniques. The particle advection algorithm (moving particles along vector fields) is directly applicable to showing wind effects on ring tethers. Limited to surface/single-level data by default; would need modification for multi-altitude display. Note: earth.nullschool.net itself supports multiple altitude levels (10hPa through 1000hPa) but those features are in the closed-source production version, not the open repository.

### 1.3 meteoJS

- **URL**: https://github.com/chird/meteoJS
- **License**: MIT
- **Language**: JavaScript
- **Capabilities**: Meteorological tools library. Includes Skew-T log-P diagram plotting (critical for atmospheric sounding visualization), thermodynamic calculations, synoptic symbol rendering.
- **Web Feasibility**: Pure JS library, usable in browser.
- **Tethered Ring Relevance**: MODERATE. Skew-T diagrams visualize temperature and wind profiles from surface to stratosphere, which is exactly the vertical cross-section relevant to the 0-32 km tether corridor. Could visualize radiosonde data showing conditions along tether paths.

### 1.4 noaa-gfs-js

- **URL**: https://github.com/nickginsberg/noaa-gfs-js
- **License**: MIT
- **Language**: TypeScript
- **Capabilities**: Lightweight library for pulling GFS weather data from NOAA via OpenDAP. No external binary dependencies (does not require ecCodes/wgrib2). Returns lat/lon/time dimensions with data in array and object formats.
- **Web Feasibility**: Designed for Node.js but data retrieval pattern could be adapted for server-side use feeding a web frontend.
- **Tethered Ring Relevance**: HIGH. GFS data includes pressure-level forecasts up through the stratosphere (1 hPa ~ 48 km). Can retrieve wind speed/direction, temperature, and geopotential height at multiple pressure levels along the ring path. Provides a zero-cost data pipeline.

### 1.5 grib22json

- **URL**: https://github.com/BlueNetCat/grib22json
- **License**: ISC
- **Language**: JavaScript
- **Capabilities**: Pure JavaScript decoder for GRIB2 binary data format. Supports decoding GFS data from NOAA. Still in development; does not support all GRIB2 features.
- **Web Feasibility**: Browser-compatible JS. Enables client-side parsing of weather model output without server-side tools.
- **Tethered Ring Relevance**: MODERATE. Enables direct browser-based ingestion of GFS GRIB2 files, which could allow the simulation to load real forecast data for any pressure level. Eliminates need for server-side preprocessing.

---

## 2. Python Atmospheric/Weather Packages

These would run server-side or be used for data preprocessing. Some could potentially be compiled to WASM.

### 2.1 MetPy

- **URL**: https://unidata.github.io/python-training/python/intro-to-python/
- **GitHub**: https://github.com/Unidata/MetPy
- **License**: BSD 3-Clause
- **Language**: Python (NumPy, SciPy, Matplotlib, xarray)
- **Capabilities**: Full meteorological analysis toolkit. Unit-aware calculations, cross-sections, Skew-T plotting, wind barbs, station model plots. Parses NEXRAD, GINI, METAR, GEMPAK formats. Thermodynamic calculations (CAPE, LCL, LFC, etc.). Kinematic functions (divergence, vorticity, advection).
- **Web Feasibility**: Server-side only. Could precompute atmospheric profiles that are served as JSON to a JS frontend. Pyodide (Python in WASM) could theoretically run MetPy in browser but would be heavy.
- **Tethered Ring Relevance**: HIGH for data preparation. Can compute wind shear profiles, stability indices, and cross-sections through the stratosphere from reanalysis data. Would be the primary tool for generating the atmospheric profile datasets the web simulation consumes.

### 2.2 xarray + netCDF4

- **URL**: https://xarray.dev/
- **License**: Apache 2.0
- **Language**: Python
- **Capabilities**: N-dimensional labeled array library. Native support for NetCDF, GRIB, Zarr formats. Handles ERA5/GFS/MERRA-2 datasets with labeled dimensions (time, lat, lon, pressure level). Integrates with Dask for out-of-core/parallel computation on massive datasets.
- **Web Feasibility**: Server-side. Essential for preprocessing reanalysis data.
- **Tethered Ring Relevance**: HIGH. The primary tool for loading and manipulating ERA5 pressure-level data. Can slice vertical profiles along the ring's path, extract wind/temperature/density at specific pressure levels (e.g., 10 hPa ~ 30 km). Used extensively in stratospheric research.

### 2.3 ambiance

- **URL**: https://pypi.org/project/ambiance/
- **License**: Apache 2.0
- **Language**: Python
- **Capabilities**: Full implementation of the ICAO Standard Atmosphere 1993. Computes temperature, pressure, density, speed of sound, viscosity, thermal conductivity from altitude input. Vectorized (accepts arrays of altitudes).
- **Web Feasibility**: Simple enough to port to JS or run via Pyodide. Mathematical formulas are straightforward.
- **Tethered Ring Relevance**: HIGH. Provides the baseline atmospheric model for the 0-32 km tether corridor. ISA gives standard temperature (216.65 K at 32 km), pressure (868 Pa), and density (0.0136 kg/m^3). Essential for initial engineering calculations before layering real weather data on top.

### 2.4 fluids (atmosphere module)

- **URL**: https://fluids.readthedocs.io/fluids.atmosphere.html
- **GitHub**: https://github.com/CalebBell/fluids
- **License**: MIT
- **Language**: Python
- **Capabilities**: Chemical Engineering Design Library. The `ATMOSPHERE_1976` class calculates T, P, rho, speed of sound, viscosity, thermal conductivity, and gravity as a function of altitude from -610 m to 86,000 m. Also includes wind speed models and atmospheric property functions.
- **Web Feasibility**: Server-side, but the atmosphere module is self-contained and could be ported to JS.
- **Tethered Ring Relevance**: HIGH. Covers the full altitude range needed (surface to 86 km). The 86 km ceiling goes well above the 32 km tethered ring. Includes gravity variation with altitude, which matters for tether catenary calculations.

### 2.5 PyAtmos

- **URL**: https://pypi.org/project/pyatmos/
- **License**: MIT
- **Language**: Python
- **Capabilities**: Implements both NRLMSISE-00 and JB2008 atmospheric models. Calculates atmospheric constituent densities (N2, O2, Ar, He, O, N) and temperature. Recommended by COSPAR as the standard for thermospheric density in satellite drag calculations. Downloads and uses space weather indices (F10.7, Ap, etc.).
- **Web Feasibility**: Server-side. Complex model with space weather dependencies.
- **Tethered Ring Relevance**: HIGH for the classic orbital ring at 300-600 km. NRLMSISE-00 is the standard model for computing atmospheric drag at LEO altitudes. Less relevant for the 32 km tethered ring (ISA is sufficient there), but essential for the orbital ring variant's drag calculations and momentum replenishment budget.

### 2.6 poliastro

- **URL**: https://docs.poliastro.space/
- **GitHub**: https://github.com/poliastro/poliastro
- **License**: MIT
- **Language**: Python
- **Capabilities**: Astrodynamics library. Orbit propagation, maneuver planning, atmospheric drag modeling (COESA76 atmosphere), perturbation analysis (J2, atmospheric drag, third body). Visualization of orbits.
- **Web Feasibility**: Server-side. Could precompute orbital decay and drag data.
- **Tethered Ring Relevance**: MODERATE-HIGH for the classic orbital ring. Models orbital mechanics and atmospheric drag at LEO altitudes. Can simulate the rotor's orbital behavior, precession, and drag-induced decay. Not relevant to the 32 km tethered ring variant.

### 2.7 ussa1976

- **URL**: https://github.com/rayference/ussa1976
- **License**: MIT
- **Language**: Python
- **Capabilities**: Faithful implementation of the NASA TM-X-74335 US Standard Atmosphere 1976. Computes temperature, pressure, density, number density, mean particle speed, mean free path, collision frequency, speed of sound, dynamic viscosity, kinematic viscosity, thermal conductivity, and pressure scale height.
- **Web Feasibility**: Server-side, but formulas are well-documented and portable.
- **Tethered Ring Relevance**: HIGH. Particularly useful for the mean free path and collision frequency outputs, which are relevant to aerodynamic heating and drag calculations on tethers. The pressure scale height output directly informs how atmospheric density changes along the tether.

---

## 3. Weather Data APIs & Reanalysis Datasets

### 3.1 ERA5 (ECMWF Reanalysis v5)

- **URL**: https://cds.climate.copernicus.eu/datasets/reanalysis-era5-pressure-levels
- **Provider**: Copernicus Climate Change Service (ECMWF)
- **License**: Free for research; Copernicus License
- **Coverage**: 1940-present, global, hourly
- **Resolution**: 31 km horizontal, 137 vertical levels (surface to 80 km / 0.01 hPa)
- **Key Variables**: Temperature, wind (u,v), geopotential, humidity, vertical velocity on 37 pressure levels
- **Access**: CDS API (Python), Google Earth Engine (JS API), ARCO-ERA5 on Google Cloud (Zarr format)
- **Tethered Ring Relevance**: CRITICAL. The single most important dataset. ERA5 provides wind and temperature data at pressure levels spanning the entire 0-32 km tether corridor and beyond. The 137 model levels give ~250 m vertical resolution in the lower stratosphere. The ARCO-ERA5 dataset was specifically curated by Google's Loon project for stratospheric balloon navigation -- exactly the same altitude regime as the tethered ring. Key pressure levels: 10 hPa (~30 km), 20 hPa (~26 km), 30 hPa (~24 km), 50 hPa (~20 km).
- **Caveats**: Known cold bias in the lower stratosphere for 2000-2006 (corrected in ERA5.1). Downloading large volumes requires patience; use ARCO-ERA5 on Google Cloud for faster access. CDS API is Python-only; web integration requires a backend service.

### 3.2 GFS (Global Forecast System)

- **URL**: https://www.nco.ncep.noaa.gov/pmb/products/gfs/
- **Provider**: NOAA/NCEP
- **License**: Public domain (US Government)
- **Coverage**: Global, 4x daily forecasts out to 16 days
- **Resolution**: 0.25 degree (~28 km), 127 vertical levels
- **Key Variables**: Wind, temperature, humidity, geopotential on pressure levels up to 1 hPa (~48 km)
- **Access**: NOMADS (direct download, OpenDAP), noaa-gfs-js (TypeScript), grib22json (browser)
- **Tethered Ring Relevance**: HIGH. Free, real-time forecast data covering the stratosphere. Public domain license means no restrictions. Ideal for the "live weather" mode of the simulation. The 0.25-degree resolution is sufficient for showing large-scale stratospheric wind patterns along the ring. Refreshed every 6 hours.

### 3.3 MERRA-2 (Modern-Era Retrospective Analysis)

- **URL**: https://gmao.gsfc.nasa.gov/reanalysis/merra-2/
- **Provider**: NASA GMAO
- **License**: Free for research
- **Coverage**: 1980-present, global, hourly/3-hourly
- **Resolution**: 0.5 x 0.625 degrees, 72 vertical levels (surface to 0.01 hPa)
- **Key Variables**: Atmospheric state variables, aerosols, ozone, radiation
- **Tethered Ring Relevance**: MODERATE. Complementary to ERA5. Stronger on aerosol and composition data. Useful for understanding atmospheric optical properties along the ring (relevant to solar power and thermal management). ERA5 generally preferred for wind/temperature accuracy in the stratosphere.

### 3.4 Open-Meteo API

- **URL**: https://open-meteo.com/
- **GitHub**: https://github.com/open-meteo/open-meteo
- **License**: AGPLv3 (self-hosted) / Free for non-commercial use
- **Coverage**: Global forecasts from DWD ICON, NOAA GFS, ECMWF
- **Resolution**: Varies by source model
- **Key Variables**: Temperature, wind, humidity, cloud cover, geopotential at 20+ pressure levels up to ~22 km
- **Access**: REST API with JSON response. No API key needed for non-commercial use.
- **Tethered Ring Relevance**: MODERATE-HIGH. Easiest integration path for a web app -- simple REST calls return JSON. Pressure level data extends into the lower stratosphere. However, the ~22 km altitude ceiling falls short of the 32 km ring altitude. Best used for lower-tether atmospheric conditions and tropospheric weather effects.

### 3.5 Google Earth Engine

- **URL**: https://developers.google.com/earth-engine/
- **License**: Free for research, education, nonprofit
- **Capabilities**: Cloud platform for geospatial analysis. Hosts ERA5, GFS, and many other datasets. JavaScript and Python APIs.
- **Tethered Ring Relevance**: MODERATE. The JavaScript API could query ERA5 data for specific locations and times. However, Earth Engine is designed for raster/imagery analysis rather than real-time 3D simulation. Better suited for preprocessing ring-path atmospheric climatologies.

---

## 4. Full-Scale Weather Models (C/Fortran)

These are research-grade numerical weather prediction systems. Too large to run in-browser, but their output is what feeds ERA5/GFS, and simplified versions could inform physics.

### 4.1 WRF (Weather Research and Forecasting Model)

- **URL**: https://github.com/wrf-model/WRF
- **License**: Public domain
- **Language**: Fortran 90, C
- **Capabilities**: State-of-the-art mesoscale NWP. Simulates atmospheric dynamics from planetary to turbulence scales. Supports nested domains for high-resolution regional simulations. Parameterizations for radiation, microphysics, cumulus, boundary layer, and land surface.
- **WASM Potential**: Effectively zero. WRF requires MPI, netCDF, and massive compute resources. A single forecast can require thousands of CPU-hours.
- **Tethered Ring Relevance**: LOW for direct integration, HIGH for understanding. WRF output (via ERA5/GFS) is what we would visualize. Running WRF directly would only make sense for custom ultra-high-resolution simulations of flow around ring structures, which is a research project unto itself.

### 4.2 MPAS (Model for Prediction Across Scales)

- **URL**: https://github.com/MPAS-Dev/MPAS-Model
- **License**: BSD
- **Language**: Fortran, C
- **Capabilities**: Global atmosphere/ocean simulation on unstructured Voronoi meshes. Variable resolution (can refine mesh in regions of interest). Supports global-to-regional seamless simulations.
- **WASM Potential**: None. Requires PIO, netCDF, parallel-netCDF, MPI.
- **Tethered Ring Relevance**: LOW for direct use. The variable-resolution mesh concept is intellectually interesting -- one could imagine refining resolution along the ring's path -- but MPAS is far too heavy for browser-based simulation. Its output data could be preprocessed for visualization.

---

## 5. Atmospheric Density Models

### 5.1 NRLMSISE-00 / NRLMSIS 2.0

- **URL (npm)**: https://www.npmjs.com/package/nrlmsise
- **GitHub**: https://github.com/c0d3runn3r/nrlmsise
- **License**: Not specified (original model is public domain; npm package unlicensed)
- **Language**: C++ compiled to Node.js native module via N-API
- **Capabilities**: Empirical model of Earth's atmosphere from ground to exobase (~600+ km). Outputs temperature and number densities of N2, O2, O, He, Ar, H, N, and anomalous O. Accounts for solar activity (F10.7), geomagnetic activity (Ap), latitude, longitude, day of year, and time of day. NRLMSIS 2.0 (2021) is the successor with improved mesosphere/stratosphere and whole-atmosphere coupling.
- **Web Feasibility**: The npm package runs in Node.js (native addon). Could potentially be compiled to WASM from the C source. The original C code by Dominik Brodowski is well-suited for Emscripten compilation.
- **Tethered Ring Relevance**: CRITICAL for the classic orbital ring (300-600 km). This is the standard model for computing atmospheric drag on the orbital ring rotor. At 400 km, atmospheric density varies by orders of magnitude with solar activity (10^-12 to 10^-10 kg/m^3), directly controlling the power needed to maintain rotor velocity. Also useful for the tethered ring's mesosphere/stratosphere region (20-32 km) where it provides constituent densities.
- **C Source for WASM**: https://www.brodo.de/space/nrlmsise/

### 5.2 International Standard Atmosphere (ISA) / US Standard Atmosphere 1976

- **Language**: Mathematical model; implementations in every language
- **JS Implementations**: Multiple online calculators exist (Aerospaceweb, AviationHunt, AeroVia). No prominent npm package found, but the math is trivial to implement.
- **Capabilities**: Static atmospheric model. Temperature, pressure, density as a function of geometric altitude. Defined in layers with lapse rates. Valid to 86 km (US Standard) or 80 km (ICAO).
- **Tethered Ring Relevance**: HIGH. The baseline reference for all tether engineering calculations. At 32 km: T = 228.65 K (-44.5C), P = 868.0 Pa (0.86% of sea level), rho = 0.01322 kg/m^3 (1.1% of sea level). These values define the nominal operating environment. Simple enough to implement directly in TypeScript.

### 5.3 Key Atmospheric Values at Ring Altitude (32 km)

| Property | Value (ISA) | Notes |
|----------|-------------|-------|
| Temperature | 228.65 K (-44.5 C) | In stratosphere, temperature increases above tropopause |
| Pressure | 868 Pa | ~0.86% of sea level |
| Density | 0.01322 kg/m^3 | ~1.1% of sea level |
| Speed of Sound | 303 m/s | Lower than sea level (340 m/s) |
| Dynamic Viscosity | ~1.5 x 10^-5 Pa-s | Lower than sea level |
| Mean Free Path | ~0.7 mm | Still well in continuum flow regime |
| Gravity | ~9.77 m/s^2 | Only ~0.1% reduction from sea level |

---

## 6. WebGL/Three.js/WebGPU Weather Visualization

### 6.1 CesiumJS

- **URL**: https://github.com/CesiumGS/cesium
- **License**: Apache 2.0
- **Language**: JavaScript (WebGL/WebGPU)
- **Capabilities**: 3D globe and map engine. Streams terrain, imagery, and 3D Tiles. Built-in atmosphere rendering (Rayleigh + Mie scattering). Time-dynamic data support. SkyAtmosphere with customizable scattering parameters. GPU-powered wind visualization demonstrated.
- **Web Feasibility**: Mature, production-ready. Widely used in aerospace and defense.
- **Tethered Ring Relevance**: HIGH. CesiumJS is arguably the best platform for visualizing the ring in geographic context. Its atmosphere rendering extends to stratospheric altitudes. WindBorne Systems has demonstrated weather balloon trajectory visualization with CesiumJS at stratospheric altitudes -- the exact same use case. Can render tethers as polylines, ring as an entity at altitude, and overlay weather data as 3D tiles or custom primitives.

### 6.2 deck.gl + WeatherLayers

- **URL**: https://deck.gl/ and https://weatherlayers.com/
- **License**: MIT (deck.gl) / Commercial (WeatherLayers full suite, open-source components available)
- **Language**: JavaScript (WebGL2)
- **Capabilities**: GPU-accelerated data visualization layers. GlobeView provides 3D globe rendering. Particle layer animates ~1M wind particles at 60fps using transform feedback. Supports raster, contour, grid, and particle weather layers.
- **Web Feasibility**: Excellent. Production-grade with React integration.
- **Tethered Ring Relevance**: MODERATE-HIGH. The particle wind visualization would effectively show stratospheric wind patterns. The GlobeView renders at global scale. However, deck.gl is fundamentally a 2D-layers-on-globe approach rather than true 3D, which limits representation of altitude-varying phenomena.

### 6.3 Mapbox WebGL Wind

- **URL**: https://github.com/mapbox/webgl-wind
- **License**: ISC
- **Language**: JavaScript (WebGL)
- **Capabilities**: Wind power visualization using WebGL particles. Up to 1M particles at 60fps. Based on Vladimir Agafonkin's influential blog post "How I built a wind map with WebGL." Uses texture-based state management for particle positions.
- **Web Feasibility**: Lightweight, well-documented technique. The blog post is the definitive tutorial for WebGL wind visualization.
- **Tethered Ring Relevance**: MODERATE. The particle advection technique is the gold standard for wind visualization. Worth studying for implementation in a Three.js context. The approach encodes wind velocity as texture RGB channels and updates particle positions on the GPU -- directly applicable to our simulation.

### 6.4 Three.js Weather Effects

- **URL**: https://threejs.org/
- **Relevant Examples**: webgpu_compute_particles_rain, webgl_shaders_sky
- **License**: MIT
- **Language**: JavaScript (WebGL, WebGPU)
- **Capabilities**: General-purpose 3D engine. Particle systems (THREE.Points), custom shaders, instanced rendering. Recent WebGPU compute examples demonstrate rain particle simulation at high particle counts. Sky shader implements atmospheric scattering.
- **Web Feasibility**: The standard choice for 3D web applications.
- **Tethered Ring Relevance**: HIGH. Three.js is likely the rendering engine for the simulation (Project Atlantis already uses it). Weather effects can be added as custom shader materials. Atmospheric scattering shaders provide the visual context. Particle systems can visualize wind. The WebGPU path (THREE.js r165+) enables compute shaders for physics simulation.

### 6.5 WebGPU Compute (General)

- **URL**: https://web.dev/blog/webgpu-supported-major-browsers
- **Browser Support**: Chrome, Firefox, Safari, Edge (as of Nov 2025)
- **Capabilities**: GPU compute shaders in the browser. 15-30x acceleration over CPU JS. 1M+ particles at 60fps demonstrated. Navier-Stokes fluid solvers running in real-time.
- **Tethered Ring Relevance**: HIGH for future. WebGPU compute shaders could run simplified atmospheric flow simulations directly in the browser. A 2D slice of the atmosphere around a tether cross-section, solving for wind loading, could run at interactive rates. The Trinity project (https://github.com/portsmouth/Trinity) demonstrates a programmable 3D fluid simulator in WebGL that could be adapted.

### 6.6 wind-layer

- **URL**: https://github.com/sakitam-fdd/wind-layer
- **License**: MIT
- **Language**: JavaScript
- **Capabilities**: Multi-platform wind visualization plugin supporting OpenLayers, Mapbox GL, MapLibre, Leaflet, and others. Particle rendering for raster wind data, arrow layers for vector fields, layer masking. Effectively a "Windy.com clone" library.
- **Web Feasibility**: Mature, multi-platform. npm packages for each map library.
- **Tethered Ring Relevance**: MODERATE. If using a 2D map view (not 3D globe), this provides ready-made wind visualization. Could overlay the ring path onto a wind map. Limited to single-altitude view.

---

## 7. Wind Loading & Structural Analysis

### 7.1 SkyCiv API

- **URL**: https://skyciv.com/wind-load-calculator/
- **License**: Commercial (API access)
- **Capabilities**: Cloud-based structural analysis with wind load module. Supports ASCE 7-10/7-16, EN 1991, NBCC 2015, AS 1170 standards. HTTP API for programmatic wind load calculations.
- **Web Feasibility**: REST API can be called from JS.
- **Tethered Ring Relevance**: LOW. Designed for building structures, not cables/tethers. The wind loading standards assume near-surface conditions and building geometries. Not applicable to stratospheric tethers.

### 7.2 Custom Wind Loading Calculations

For tethered ring cables, wind loading must be computed from first principles:

```
F_drag = 0.5 * rho * v^2 * Cd * A
```

Where:
- `rho` = atmospheric density at altitude (from ISA or NRLMSISE)
- `v` = wind speed at altitude (from ERA5/GFS)
- `Cd` = drag coefficient (~1.2 for cables/cylinders at relevant Reynolds numbers)
- `A` = projected area of cable per unit length

At 32 km altitude with ISA conditions:
- rho = 0.01322 kg/m^3
- Typical stratospheric wind: 10-30 m/s (can reach 60+ m/s near polar vortex)
- For a 10 cm diameter cable: F = 0.5 * 0.013 * 30^2 * 1.2 * 0.1 = **0.7 N/m**
- Compared to sea level with 30 m/s wind: F = 0.5 * 1.225 * 30^2 * 1.2 * 0.1 = **66 N/m**

The 100x reduction in air density at 32 km means wind loading is dramatically reduced compared to surface conditions. However, the total cable length is enormous (~32 km per tether), so integrated loads are still significant.

### 7.3 Aeroelastic Considerations

No JavaScript-native aeroelastic simulation libraries were found. Relevant approaches:

- **QBlade** (C++/Fortran): Wind turbine aeroelastic simulation. Open source. Concepts apply to cable flutter/vibration.
- **TENSO** (non-commercial): Cable and beam FEM with wind-structure interaction. Wind velocity time history generation and aeroelastic load simulation.
- **Custom implementation**: For tethered ring cables, the key phenomena are vortex-induced vibration (VIV) and galloping. These can be modeled with relatively simple parametric models (e.g., Scruton number analysis) that are implementable in TypeScript.

---

## 8. Orbital-Altitude Atmospheric Drag (300-600 km)

For the classic orbital ring variant:

### 8.1 satellite-js

- **URL**: https://github.com/shashwatak/satellite-js
- **License**: MIT
- **Language**: JavaScript
- **Capabilities**: SGP4/SDP4 orbit propagation from TLE/OMM data. Handles atmospheric drag via BSTAR coefficient. Provides position/velocity at any time.
- **Tethered Ring Relevance**: MODERATE. Demonstrates the standard approach to orbital propagation with drag. The BSTAR model is simplified but captures the essential physics. Could be used to model the rotor's orbital behavior.

### 8.2 NRLMSISE-00 (via npm or WASM)

As described in Section 5.1. At orbital ring altitudes:

| Altitude | Density (solar min) | Density (solar max) | Drag Power* |
|----------|--------------------|--------------------|-------------|
| 300 km | ~3 x 10^-11 kg/m^3 | ~3 x 10^-10 kg/m^3 | ~0.02 GW |
| 400 km | ~4 x 10^-12 kg/m^3 | ~5 x 10^-11 kg/m^3 | ~0.003 GW |
| 500 km | ~7 x 10^-13 kg/m^3 | ~1 x 10^-11 kg/m^3 | ~0.0006 GW |
| 600 km | ~2 x 10^-13 kg/m^3 | ~3 x 10^-12 kg/m^3 | ~0.0002 GW |

*Approximate power to maintain velocity for a 1 m^2 cross-section ring at 8 km/s

### 8.3 Orekit (Java/Python)

- **URL**: https://www.orekit.org/
- **License**: Apache 2.0
- **Language**: Java (Python wrapper available)
- **Capabilities**: Full astrodynamics library. Multiple atmospheric drag models (DTM2000, JB2008, NRLMSISE-00, Harris-Priester, exponential). High-fidelity orbit propagation with all perturbations.
- **Web Feasibility**: No JavaScript port exists. Would need to run server-side.
- **Tethered Ring Relevance**: HIGH for accurate orbital ring modeling. The most complete open-source toolkit for orbital mechanics with atmospheric drag.

---

## 9. Stratospheric Wind Patterns -- Key Data for Tethered Ring

### 9.1 Jet Streams

The subtropical jet stream typically flows at 9-12 km altitude (250-300 hPa), well below the 32 km ring. However, the **polar night jet** in the stratosphere can extend to 50+ km and produce winds of 50-100 m/s at 10 hPa (~30 km). This is the most significant atmospheric threat to the tethered ring.

### 9.2 Quasi-Biennial Oscillation (QBO)

The QBO is a ~28-month oscillation in tropical stratospheric winds between easterly and westerly regimes. At 30 km altitude in the tropics, wind direction reverses regularly with amplitudes of 20-30 m/s. ERA5 captures the QBO well.

### 9.3 Polar Vortex

The stratospheric polar vortex (typically monitored at 10 hPa / ~30 km) produces strong circumpolar winds in winter. The Northern Hemisphere vortex peaks in December-January. Sudden Stratospheric Warmings (SSWs) can dramatically alter wind patterns in days. For a Pacific Rim ring path, the ring passes through latitudes affected by the polar vortex edge.

### 9.4 Data Visualization Strategy

For the simulation, stratospheric wind data should be displayed at multiple levels:
- **Surface to 12 km**: Tropospheric weather (storms, jet stream). Primary visual interest.
- **12-20 km**: Tropopause transition. Generally calm.
- **20-32 km**: Lower stratosphere. QBO in tropics; polar vortex at high latitudes. This is the operating environment.
- **32 km**: Ring altitude. Visualize wind vectors along the ring path.

---

## 10. Recommended Architecture

### Data Pipeline

```
ERA5/GFS (reanalysis/forecast data)
  |
  v
Python preprocessing (xarray + MetPy)
  - Extract vertical profiles along ring path
  - Compute wind loading per tether
  - Generate atmospheric cross-sections
  - Output as JSON/binary ArrayBuffer
  |
  v
Node.js API server (or static pre-generated files)
  |
  v
Browser (Three.js / CesiumJS)
  - 3D visualization of ring + tethers + atmosphere
  - Wind particle animation (WebGL/WebGPU)
  - Real-time ISA calculations (TypeScript)
  - NRLMSISE via WASM (for orbital ring mode)
```

### Priority Implementation Order

1. **ISA model in TypeScript** -- trivial to implement, gives baseline atmospheric properties for all engineering calculations. No dependencies.

2. **GFS data integration via noaa-gfs-js** -- real wind data at stratospheric pressure levels. Free, public domain, refreshed every 6 hours.

3. **CesiumJS or Three.js globe with wind visualization** -- use the Mapbox WebGL wind technique (GPU particle advection) to show stratospheric winds on a 3D globe. Project Atlantis already uses Three.js, so extending that is likely the path of least resistance.

4. **ERA5 climatology preprocessing** -- use xarray + MetPy to generate seasonal/monthly average wind and temperature profiles along the ring path. Serve as static JSON for "typical conditions" mode.

5. **NRLMSISE-00 WASM compilation** -- compile the C implementation to WASM for in-browser atmospheric density calculations covering both the tethered ring (32 km) and orbital ring (300-600 km) regimes.

6. **Wind loading calculator in TypeScript** -- implement `F = 0.5 * rho * v^2 * Cd * A` with altitude-varying inputs. Integrate with tether catenary solver.

7. **WebGPU atmospheric flow visualization** -- long-term goal. Use compute shaders for simplified 2D fluid simulation around tether cross-sections showing vortex shedding and wake effects.

---

## 11. Summary Table

| Package | Language | License | Altitude Range | Web Ready | Priority |
|---------|----------|---------|----------------|-----------|----------|
| ISA/USSA76 (custom) | TS | N/A | 0-86 km | Yes | P0 |
| noaa-gfs-js | TS | MIT | Surface-48 km | Yes (Node) | P1 |
| CesiumJS | JS | Apache 2.0 | Globe + atm | Yes | P1 |
| Fluid Earth | JS | MIT | Surface | Yes | P2 (ref) |
| cambecc/earth | JS | MIT | Surface | Yes | P2 (ref) |
| ERA5 dataset | Data | Copernicus | Surface-80 km | Via API | P1 |
| GFS dataset | Data | Public domain | Surface-48 km | Via API | P1 |
| Open-Meteo API | REST | AGPLv3 | Surface-22 km | Yes | P2 |
| MetPy | Python | BSD | All | Server | P1 |
| xarray | Python | Apache 2.0 | All | Server | P1 |
| ambiance | Python | Apache 2.0 | 0-81 km | Server | P2 |
| fluids | Python | MIT | 0-86 km | Server | P2 |
| PyAtmos | Python | MIT | Thermo (100+km) | Server | P2 |
| nrlmsise (npm) | C++/Node | Unlicensed | Ground-exobase | Node only | P2 |
| NRLMSISE C source | C | Public domain | Ground-exobase | WASM target | P1 |
| satellite-js | JS | MIT | LEO orbits | Yes | P3 |
| poliastro | Python | MIT | LEO orbits | Server | P3 |
| Orekit | Java | Apache 2.0 | LEO orbits | Server | P3 |
| deck.gl | JS | MIT | Globe viz | Yes | P2 |
| wind-layer | JS | MIT | Surface wind | Yes | P3 |
| Three.js | JS | MIT | 3D rendering | Yes | P0 |
| WebGPU Compute | JS/WGSL | N/A | N/A | Yes (2025+) | P2 |
| WRF | Fortran | Public domain | All | No | P4 (ref) |
| MPAS | Fortran | BSD | All | No | P4 (ref) |

Priority: P0 = implement first, P1 = core infrastructure, P2 = important enhancement, P3 = nice to have, P4 = reference only
