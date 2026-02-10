"use client";

import { useState } from "react";
import {
  buildCampaignTree,
  findNode,
  getTopLevelIds,
} from "@/lib/data/buildCampaignTree";
import { MissionSidebar } from "@/components/dom/MissionSidebar";
import { NodeDetail } from "@/components/dom/NodeDetail";

export default function CampaignPage() {
  const [selectedId, setSelectedId] = useState<string | null>("1");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(getTopLevelIds())
  );

  const selectedNode = selectedId ? findNode(selectedId) ?? null : null;

  function handleToggle(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="flex h-screen">
      <MissionSidebar
        nodes={buildCampaignTree}
        selectedId={selectedId}
        expandedIds={expandedIds}
        onSelect={setSelectedId}
        onToggle={handleToggle}
      />
      <main className="flex-1 overflow-y-auto">
        <NodeDetail node={selectedNode} />
      </main>
    </div>
  );
}
