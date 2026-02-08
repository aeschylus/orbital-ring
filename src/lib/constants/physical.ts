// Physical constants for orbital ring simulation

export const EARTH = {
  RADIUS_KM: 6371, // Mean radius in km
  RADIUS_M: 6_371_000, // Mean radius in meters
  MASS_KG: 5.972e24,
  GM: 3.986004418e14, // Gravitational parameter (m^3/s^2)
  J2: 1.08263e-3, // Second zonal harmonic (oblateness)
  ROTATION_RATE: 7.2921159e-5, // rad/s
  EQUATORIAL_CIRCUMFERENCE_KM: 40_075,
} as const;

export const PHYSICS = {
  G: 6.674e-11, // Gravitational constant (N⋅m²/kg²)
  BOLTZMANN: 1.380649e-23, // Boltzmann constant (J/K)
} as const;

// ISA (International Standard Atmosphere) parameters
export const ISA = {
  SEA_LEVEL_TEMPERATURE: 288.15, // K (15°C)
  SEA_LEVEL_PRESSURE: 101_325, // Pa
  SEA_LEVEL_DENSITY: 1.225, // kg/m³
  LAPSE_RATE_TROPOSPHERE: -0.0065, // K/m (0-11 km)
  TROPOPAUSE_ALTITUDE: 11_000, // m
  TROPOPAUSE_TEMPERATURE: 216.65, // K (-56.5°C)
  // Stratosphere: 11-20 km isothermal at 216.65 K
  // 20-32 km lapse rate: +0.001 K/m
  STRATOSPHERE_LAPSE_20_32: 0.001, // K/m
  // At 32 km:
  ALTITUDE_32KM_TEMPERATURE: 228.65, // K (-44.5°C)
  ALTITUDE_32KM_PRESSURE: 868.0, // Pa (~0.86% sea level)
  ALTITUDE_32KM_DENSITY: 0.01322, // kg/m³ (~1.1% sea level)
} as const;

// Orbital ring reference parameters
export const ORBITAL_RING = {
  LEO_ALTITUDE_KM: 400, // Reference LEO altitude
  ORBITAL_VELOCITY_MS: 7_672, // m/s at 400 km
  ROTOR_VELOCITY_MS: 8_000, // Typical rotor velocity
} as const;

// Tethered ring (Project Atlantis) reference parameters
export const TETHERED_RING = {
  ALTITUDE_KM: 32,
  CIRCUMFERENCE_KM: 32_000,
  SHUTTLE_VELOCITY_MS: 5_800, // Mach 17
  INTERCONTINENTAL_VELOCITY_MS: 1_020, // Mach 3
  POPULATION_CAPACITY: 250_000,
  NUM_RINGS: 4,
} as const;

// Scale factors for visualization
export const SCALE = {
  // Three.js units = km for our primary view
  KM_TO_SCENE: 1,
  M_TO_SCENE: 0.001,
} as const;
