"use client";

import type { TreeNode } from "@/lib/data/buildCampaignTree";
import { StageDiagramEmbed } from "./StageDiagramEmbed";

interface NodeDetailProps {
  node: TreeNode | null;
}

function StatusBadge({ status }: { status: TreeNode["status"] }) {
  const styles = {
    complete: "bg-green-900/50 text-green-400 border-green-700",
    "in-progress": "bg-blue-900/50 text-blue-400 border-blue-700",
    planned: "bg-gray-800/50 text-gray-400 border-gray-700",
  };

  return (
    <span
      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ProjectOverview() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8">
      <h1 className="mb-4 text-3xl font-bold tracking-tight text-white">
        Build Campaign
      </h1>
      <p className="mb-2 max-w-2xl text-center text-lg text-gray-300 leading-relaxed">
        100,000 self-linking satellites launched, deployed, and connected to form
        a continuous orbital ring. From individual satellite mechanisms to full
        multi-ring infrastructure.
      </p>
      <p className="text-sm text-gray-500">
        Select a node in the sidebar to explore the simulation hierarchy.
      </p>
    </div>
  );
}

export function NodeDetail({ node }: NodeDetailProps) {
  if (!node) {
    return <ProjectOverview />;
  }

  return (
    <div className="max-w-3xl px-8 py-10">
      <StatusBadge status={node.status} />

      <h2 className="mt-3 text-2xl font-semibold text-white">
        {node.id}. {node.label}
      </h2>

      <p className="mt-4 text-gray-300 leading-relaxed">{node.description}</p>

      {!node.id.includes(".") && (
        <div className="mt-6">
          <StageDiagramEmbed nodeId={node.id} />
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Sub-tasks
          </h3>
          <ul className="space-y-2">
            {node.children.map((child) => (
              <li key={child.id} className="flex items-start gap-2">
                <span
                  className={`mt-1.5 flex-shrink-0 h-2 w-2 rounded-full ${
                    child.status === "complete"
                      ? "bg-green-500"
                      : child.status === "in-progress"
                        ? "bg-blue-500"
                        : "bg-gray-600"
                  }`}
                />
                <span className="text-gray-300 text-sm">
                  {child.id}. {child.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {node.simulationRoute && (
        <a
          href={node.simulationRoute}
          className="mt-8 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Open Simulation
        </a>
      )}
    </div>
  );
}
