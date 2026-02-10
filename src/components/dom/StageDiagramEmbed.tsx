"use client";

import dynamic from "next/dynamic";

const SatelliteDesignDiagram = dynamic(
  () =>
    import("@/components/canvas/diagrams/SatelliteDesignDiagram").then(
      (mod) => mod.SatelliteDesignDiagram
    ),
  { ssr: false, loading: () => <DiagramLoading /> }
);

const LaunchCampaignDiagram = dynamic(
  () =>
    import("@/components/canvas/diagrams/LaunchCampaignDiagram").then(
      (mod) => mod.LaunchCampaignDiagram
    ),
  { ssr: false, loading: () => <DiagramLoading /> }
);

const LinkingDiagram = dynamic(
  () =>
    import("@/components/canvas/diagrams/LinkingDiagram").then(
      (mod) => mod.LinkingDiagram
    ),
  { ssr: false, loading: () => <DiagramLoading /> }
);

const ThreadingDiagram = dynamic(
  () =>
    import("@/components/canvas/diagrams/ThreadingDiagram").then(
      (mod) => mod.ThreadingDiagram
    ),
  { ssr: false, loading: () => <DiagramLoading /> }
);

const BootstrapDiagram = dynamic(
  () =>
    import("@/components/canvas/diagrams/BootstrapDiagram").then(
      (mod) => mod.BootstrapDiagram
    ),
  { ssr: false, loading: () => <DiagramLoading /> }
);

const InfrastructureDiagram = dynamic(
  () =>
    import("@/components/canvas/diagrams/InfrastructureDiagram").then(
      (mod) => mod.InfrastructureDiagram
    ),
  { ssr: false, loading: () => <DiagramLoading /> }
);

function DiagramLoading() {
  return (
    <div className="flex h-[500px] w-full items-center justify-center rounded-xl border border-gray-700/50 bg-[#0a0a0f]">
      <div className="text-center">
        <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto" />
        <p className="text-xs text-gray-500">Loading diagram...</p>
      </div>
    </div>
  );
}

const diagramMap: Record<string, React.ComponentType> = {
  "1": SatelliteDesignDiagram,
  "2": LaunchCampaignDiagram,
  "3": LinkingDiagram,
  "4": ThreadingDiagram,
  "5": BootstrapDiagram,
  "6": InfrastructureDiagram,
};

interface StageDiagramEmbedProps {
  nodeId: string;
}

export function StageDiagramEmbed({ nodeId }: StageDiagramEmbedProps) {
  const Diagram = diagramMap[nodeId];
  if (!Diagram) return null;
  return <Diagram />;
}
