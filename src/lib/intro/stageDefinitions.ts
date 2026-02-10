export interface StageDefinition {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number; // seconds
}

export const STAGES: StageDefinition[] = [
  {
    id: 1,
    key: "satelliteDesign",
    title: "Satellite Design",
    subtitle: "Engineering the Building Blocks",
    description:
      "Each orbital ring segment is a precision-engineered satellite: a superconducting tube with deployable solar panels and electromagnetic coupling rings.",
    duration: 8,
  },
  {
    id: 2,
    key: "bulkLaunches",
    title: "Bulk Launches",
    subtitle: "Scaling to Orbit",
    description:
      "Hundreds of heavy-lift vehicles deliver satellite batches to low Earth orbit, building up the constellation over months of sustained launch cadence.",
    duration: 10,
  },
  {
    id: 3,
    key: "orbitalPhasing",
    title: "Orbital Phasing",
    subtitle: "Finding Their Slots",
    description:
      "Ion thrusters nudge each satellite into its designated orbital slot, forming an evenly-spaced ring around Earth's equator.",
    duration: 8,
  },
  {
    id: 4,
    key: "deployment",
    title: "Deployment",
    subtitle: "Unfolding in Space",
    description:
      "Each satellite unfolds from its compact launch configuration — extending its tube segment, deploying solar panels, and activating coupling rings.",
    duration: 10,
  },
  {
    id: 5,
    key: "linking",
    title: "Linking",
    subtitle: "Electromagnetic Coupling",
    description:
      "Adjacent satellites dock and engage electromagnetic coupling, forming a continuous ring structure with no physical joints.",
    duration: 8,
  },
  {
    id: 6,
    key: "rotorAcceleration",
    title: "Rotor Acceleration",
    subtitle: "Spinning Up to Speed",
    description:
      "A stream of ferromagnetic mass is accelerated through the tube to orbital velocity, generating the centrifugal force that supports the ring above its natural orbit.",
    duration: 10,
  },
  {
    id: 7,
    key: "bootstrapRedundancy",
    title: "Bootstrap Redundancy",
    subtitle: "Connecting Earth to Space",
    description:
      "Tethers descend from the ring to ground anchors. Climber vehicles begin ferrying materials upward, enabling construction of additional ring strands.",
    duration: 10,
  },
];

export const TOTAL_DURATION = STAGES.reduce((sum, s) => sum + s.duration, 0);

export function getStageStartTime(stageIndex: number): number {
  return STAGES.slice(0, stageIndex).reduce((sum, s) => sum + s.duration, 0);
}
