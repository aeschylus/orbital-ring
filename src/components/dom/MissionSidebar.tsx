"use client";

import Link from "next/link";
import type { TreeNode } from "@/lib/data/buildCampaignTree";
import { MissionTree } from "./MissionTree";

interface MissionSidebarProps {
  nodes: TreeNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}

export function MissionSidebar({
  nodes,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
}: MissionSidebarProps) {
  return (
    <aside className="sidebar-scroll flex w-80 flex-shrink-0 flex-col border-r border-white/10 bg-black/70 backdrop-blur-sm">
      <div className="border-b border-white/10 px-4 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Build Campaign
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <MissionTree
          nodes={nodes}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
        />
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <Link
          href="/simulation"
          className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          Launch Simulation
        </Link>
      </div>
    </aside>
  );
}
