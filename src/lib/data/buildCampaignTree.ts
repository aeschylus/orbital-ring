export type NodeStatus = "planned" | "in-progress" | "complete";

export interface TreeNode {
  id: string;
  label: string;
  description: string;
  status: NodeStatus;
  simulationRoute?: string;
  children?: TreeNode[];
}

export const buildCampaignTree: TreeNode[] = [
  {
    id: "1",
    label: "Satellite Design",
    description:
      "Each of the 100,000 satellites is a self-contained unit that must survive launch, deploy its structure in orbit, and mechanically link with its neighbors. Design spans thermal protection, origami-inspired unfolding, accelerator tube segments, and electromagnetic coupling interfaces.",
    status: "planned",
    children: [
      {
        id: "1.1",
        label: "Structural Shell & Thermal Protection",
        description:
          "The outer shell must withstand Mach 17 aerothermal loads during launch and the thermal cycling of LEO. Materials trade studies compare carbon-carbon composites, ceramic matrix composites, and ablative coatings for the boost phase heat shield.",
        status: "planned",
      },
      {
        id: "1.2",
        label: "Unfolding Mechanism (Origami Deployment)",
        description:
          "Satellites launch in a compact stowed configuration and deploy to full operational geometry in orbit. The unfolding mechanism uses rigid-foldable origami patterns with motorized hinges, simulated using the FOLD format and Origami Simulator.",
        status: "planned",
        children: [
          {
            id: "1.2.1",
            label: "Fold Pattern Design",
            description:
              "Miura-ori and Yoshizawa variants are evaluated for their deployment ratio and structural stiffness in the deployed state. The fold pattern must allow the accelerator tube segment to extend linearly while keeping the coupling interfaces aligned.",
            status: "planned",
          },
          {
            id: "1.2.2",
            label: "Hinge Dynamics",
            description:
              "Each hinge joint is modeled as a Rapier.js revolute constraint with configurable stiffness and damping. The simulation captures deployment torques, latch engagement, and the transition from folded to locked-open state.",
            status: "planned",
          },
          {
            id: "1.2.3",
            label: "Deployment Sequence Timing",
            description:
              "The deployment sequence must complete within the orbital window before neighboring satellites arrive for linking. Timing analysis covers motor actuation rates, sequential vs. parallel unfolding, and fault recovery if a hinge stalls.",
            status: "planned",
          },
        ],
      },
      {
        id: "1.3",
        label: "Accelerator Tube Segment",
        description:
          "Each satellite carries one segment of the continuous accelerator tube. The tube must maintain vacuum integrity, precise bore alignment, and electromagnetic field uniformity across the segment length. Segment-to-segment joints form during the linking phase.",
        status: "planned",
      },
      {
        id: "1.4",
        label: "Electromagnetic Coupling Interface",
        description:
          "The coupling interface enables mechanical and electrical connection between adjacent satellites. Electromagnetic actuators guide the final approach while passive alignment features ensure repeatable joint geometry across all 100,000 connections.",
        status: "planned",
      },
      {
        id: "1.5",
        label: "Onboard Propulsion & Attitude Control",
        description:
          "Each satellite needs enough delta-v for orbital insertion correction, phasing maneuvers, and fine approach during linking. Reaction wheels handle attitude control while cold-gas or electric thrusters provide translational authority.",
        status: "planned",
      },
    ],
  },
  {
    id: "2",
    label: "Launch Campaign",
    description:
      "Delivering 100,000 satellites to their correct orbital slots requires a sustained, coordinated launch campaign across multiple sites. Orbital mechanics, atmospheric conditions, and launch vehicle availability all constrain the cadence and sequencing.",
    status: "planned",
    children: [
      {
        id: "2.1",
        label: "Launch Vehicle Selection & Payload Integration",
        description:
          "Vehicle selection balances payload capacity, cost per kilogram, and launch cadence capability. Each vehicle carries a batch of folded satellites in a dispenser rack designed for sequential deployment at precise orbital positions.",
        status: "planned",
      },
      {
        id: "2.2",
        label: "Orbital Window Optimization",
        description:
          "Launch windows must account for orbital mechanics constraints including perturbations and drag. Each window targets a specific set of orbital slots, optimizing for fuel-efficient insertion and minimal phasing maneuvers.",
        status: "planned",
        children: [
          {
            id: "2.2.1",
            label: "J2\u2013J4 Perturbation Modeling",
            description:
              "Earth's oblate shape causes precession of the orbital plane and argument of perigee. J2 through J4 zonal harmonics are modeled to predict long-term orbital evolution and plan corrective maneuvers for each satellite batch.",
            status: "planned",
          },
          {
            id: "2.2.2",
            label: "Atmospheric Drag (NRLMSISE-00)",
            description:
              "Residual atmosphere at 300\u2013600 km altitude causes orbital decay that varies with solar activity. The NRLMSISE-00 model provides density estimates for drag calculation, informing altitude maintenance budgets and deorbit timelines for failed units.",
            status: "planned",
          },
        ],
      },
      {
        id: "2.3",
        label: "Launch Site Coordination & Cadence",
        description:
          "Multiple launch sites operating in parallel can sustain the required cadence. Site coordination handles range scheduling, weather holds, and the logistics of satellite delivery, fueling, and integration at each facility.",
        status: "planned",
      },
      {
        id: "2.4",
        label: "Constellation Phasing & Slot Assignment",
        description:
          "Each satellite is assigned an orbital slot that determines its position in the final ring. Phasing maneuvers spread satellites evenly around the orbit, accounting for differential drift rates and the linking sequence order.",
        status: "planned",
      },
      {
        id: "2.5",
        label: "Failure & Replacement Scheduling",
        description:
          "With 100,000 units, some percentage will fail during launch, deployment, or linking. The campaign maintains a replacement pipeline with hot spares on the ground and contingency launch slots to fill gaps without disrupting the linking sequence.",
        status: "planned",
      },
    ],
  },
  {
    id: "3",
    label: "Orchestration, Synchronization & Linking",
    description:
      "Once deployed, satellites must find their neighbors, dock electromagnetically, and verify structural integrity. This phase transforms 100,000 individual spacecraft into a continuous ring structure through coordinated proximity operations.",
    status: "planned",
    children: [
      {
        id: "3.1",
        label: "Proximity Operations & Rendezvous",
        description:
          "Each satellite uses onboard sensors and ground-based tracking to navigate toward its assigned neighbors. Relative navigation switches from GPS-based to lidar/camera-based as the closing distance drops below 100 meters.",
        status: "planned",
      },
      {
        id: "3.2",
        label: "Electromagnetic Docking Sequence",
        description:
          "The final approach and capture uses electromagnetic actuators to guide alignment and dampen contact dynamics. The docking sequence is autonomous but ground-monitored, with abort capability if alignment tolerances are exceeded.",
        status: "planned",
      },
      {
        id: "3.3",
        label: "Structural Verification After Link",
        description:
          "After each link, sensors verify joint alignment, electrical continuity, and mechanical preload. Failed joints trigger an undock-retry sequence or a replacement satellite request if the joint cannot be established.",
        status: "planned",
      },
      {
        id: "3.4",
        label: "Arc Segment Formation",
        description:
          "Satellites link into arc segments of increasing length. Each arc behaves as a flexible structure whose dynamics change as it grows, requiring updated control algorithms at each stage of assembly.",
        status: "planned",
      },
      {
        id: "3.5",
        label: "Full Ring Closure & Integrity Check",
        description:
          "The final link closes the ring into a continuous loop. This is the highest-risk operation: the two arc endpoints must meet with sub-centimeter accuracy while the ring's natural oscillation modes are actively damped.",
        status: "planned",
      },
    ],
  },
  {
    id: "4",
    label: "Threading & Acceleration Dynamics",
    description:
      "With the ring structure complete, the accelerator tube segments are activated to spin up the internal rotor mass. The rotor provides the centrifugal force that supports the ring against gravity, transitioning from a passive structure to an active one.",
    status: "planned",
    children: [
      {
        id: "4.1",
        label: "Tube Segment Insertion Sequence",
        description:
          "Rotor elements are fed into the tube at injection stations spaced around the ring. The insertion sequence must avoid collisions between elements and maintain vacuum integrity in already-active tube sections.",
        status: "planned",
      },
      {
        id: "4.2",
        label: "Independent Acceleration Ramp-Up",
        description:
          "Each tube section begins accelerating its rotor elements independently before the full ring is connected. Ramp-up profiles are coordinated to achieve synchronized velocity across all segments at the moment of tube-to-tube handoff.",
        status: "planned",
        children: [
          {
            id: "4.2.1",
            label: "Maglev Rotor Spin-Up Profile",
            description:
              "The maglev drive applies increasing force to the rotor stream, following a profile that balances acceleration rate against power consumption and thermal limits. Target velocity is 8\u201310 km/s for LEO orbital support.",
            status: "planned",
          },
          {
            id: "4.2.2",
            label: "Counter-Rotating Stream Balancing",
            description:
              "Two counter-rotating mass streams cancel angular momentum to prevent the ring from torquing. Stream velocities must be balanced to within 0.1% to avoid secular attitude drift of the ring structure.",
            status: "planned",
          },
        ],
      },
      {
        id: "4.3",
        label: "Vibration & Oscillation Damping",
        description:
          "The spinning rotor excites structural modes in the ring. Active damping systems at each satellite node sense vibrations and apply corrective forces through the electromagnetic couplings to keep oscillations within tolerance.",
        status: "planned",
      },
      {
        id: "4.4",
        label: "Centrifugal Force Equilibrium",
        description:
          "At operational speed, centrifugal force from the rotor exactly balances gravitational pull on the ring and its payload. This equilibrium defines the ring's stable altitude and is the fundamental operating principle of the orbital ring.",
        status: "planned",
      },
    ],
  },
  {
    id: "5",
    label: "Bootstrap Redundancy (First Ring \u2192 Multi-Strand)",
    description:
      "A single ring is fragile. The bootstrap phase uses the first operational ring to haul materials for building additional strands, progressively increasing load capacity and redundancy until the structure can survive multiple simultaneous failures.",
    status: "planned",
    children: [
      {
        id: "5.1",
        label: "Structural Load Analysis",
        description:
          "The first ring must support its own weight plus the loads imposed by tethers, climbers, and construction equipment. Structural analysis determines safe operating margins and identifies the critical failure modes.",
        status: "planned",
        children: [
          {
            id: "5.1.1",
            label: "Tether Catenary Under Gravity + Wind",
            description:
              "Tethers connecting the ring to the surface follow catenary curves modified by wind loads at each altitude layer. The ISA model provides baseline conditions while ERA5/GFS data captures weather variability.",
            status: "planned",
          },
          {
            id: "5.1.2",
            label: "Stress Distribution (FEA)",
            description:
              "Finite element analysis maps stress and strain across the ring structure under combined gravitational, centrifugal, and environmental loads. Rapier.js provides real-time structural simulation for interactive exploration.",
            status: "planned",
          },
        ],
      },
      {
        id: "5.2",
        label: "Material Hauling via First Ring",
        description:
          "The operational ring serves as a transport backbone, lifting construction materials from the surface at a fraction of rocket launch cost. Hauling capacity is initially limited and grows as additional strands come online.",
        status: "planned",
      },
      {
        id: "5.3",
        label: "Second Strand Fabrication & Attachment",
        description:
          "The second strand is built alongside the first, using materials hauled up by the ring. Attachment points are pre-engineered into the first ring's design, allowing the second strand to share loads before it is independently operational.",
        status: "planned",
      },
      {
        id: "5.4",
        label: "Load Transfer & Redundancy Validation",
        description:
          "As each new strand comes online, loads are progressively transferred to verify structural integrity. The system must demonstrate that any single strand can be taken offline for maintenance without exceeding limits on the remaining strands.",
        status: "planned",
      },
      {
        id: "5.5",
        label: "Progressive Strengthening Campaign",
        description:
          "The strengthening campaign continues until the ring reaches its design redundancy level. Each additional strand increases payload capacity and fault tolerance, following a planned sequence from minimum viable to full operational capability.",
        status: "planned",
      },
    ],
  },
  {
    id: "6",
    label: "Full Infrastructure & TetherTram",
    description:
      "The completed multi-strand ring supports a full transportation and construction infrastructure. TetherTram vehicles traverse the ring and descend tethers to the surface, enabling routine access to orbit at airline-like cost and frequency.",
    status: "planned",
    children: [
      {
        id: "6.1",
        label: "TetherTram System Design & Routing",
        description:
          "TetherTram vehicles ride along the ring structure and descend to the surface via tethers. Routing optimization determines station placement, vehicle frequency, and express vs. local service patterns for global coverage.",
        status: "planned",
      },
      {
        id: "6.2",
        label: "Bulk Material Ascent Scheduling",
        description:
          "Scheduling algorithms optimize the flow of materials from surface to ring altitude, balancing demand from construction projects against tether capacity and vehicle availability. Peak loads during construction phases require surge capacity.",
        status: "planned",
      },
      {
        id: "6.3",
        label: "Ring-to-Ring Construction Coordination",
        description:
          "Building additional rings at different altitudes or inclinations requires coordinating construction activities across the existing infrastructure. Material flow, worker transport, and structural loads must be managed across the growing network.",
        status: "planned",
      },
      {
        id: "6.4",
        label: "Multi-Ring Configuration (4-Ring Atlantis Layout)",
        description:
          "The Project Atlantis reference design uses four rings at different inclinations to provide global coverage. This configuration maximizes surface access points while distributing structural loads across the ring network.",
        status: "planned",
      },
      {
        id: "6.5",
        label: "Transit Integration (Mach 3 / Mach 17)",
        description:
          "Ring-riding vehicles can achieve point-to-point transit at Mach 3 (tethered ring at 32 km) or Mach 17 (orbital ring at 300+ km). Integration with surface transport networks enables seamless global transit with sub-hour travel times.",
        status: "planned",
      },
      {
        id: "6.6",
        label: "Energy Balance & Maintenance Budget",
        description:
          "The operational ring requires continuous energy input to overcome atmospheric drag and maintain rotor velocity. The energy balance accounts for solar power generation, regenerative braking from descending payloads, and the maintenance cycle for replacing worn components.",
        status: "planned",
      },
    ],
  },
];

// Build a flat lookup map for O(1) node access
function buildNodeMap(
  nodes: TreeNode[],
  map: Map<string, TreeNode> = new Map()
): Map<string, TreeNode> {
  for (const node of nodes) {
    map.set(node.id, node);
    if (node.children) {
      buildNodeMap(node.children, map);
    }
  }
  return map;
}

const nodeMap = buildNodeMap(buildCampaignTree);

export function findNode(id: string): TreeNode | undefined {
  return nodeMap.get(id);
}

// Collect all top-level node IDs for default expansion
export function getTopLevelIds(): string[] {
  return buildCampaignTree.map((node) => node.id);
}
