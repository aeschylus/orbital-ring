"use client";

import type { TreeNode } from "@/lib/data/buildCampaignTree";

interface MissionTreeProps {
  nodes: TreeNode[];
  selectedId: string | null;
  expandedIds: Set<string>;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  depth?: number;
}

export function MissionTree({
  nodes,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  depth = 0,
}: MissionTreeProps) {
  return (
    <ul className={depth === 0 ? "space-y-1" : "ml-4 mt-1 space-y-1"}>
      {nodes.map((node) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = expandedIds.has(node.id);
        const isSelected = selectedId === node.id;

        return (
          <li key={node.id}>
            <div
              className={`flex items-center gap-1.5 rounded px-2 py-1 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-white/5 border-l-2 border-blue-500 text-white"
                  : "border-l-2 border-transparent hover:bg-white/5 hover:text-gray-200 text-gray-400"
              }`}
            >
              {/* Chevron */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) onToggle(node.id);
                }}
                className={`flex-shrink-0 w-4 h-4 flex items-center justify-center ${
                  hasChildren
                    ? "text-gray-500 hover:text-gray-300"
                    : "invisible"
                }`}
              >
                <span
                  className={`inline-block border-r-[5px] border-b-[5px] border-r-current border-b-transparent border-t-transparent border-l-transparent transition-transform duration-150 ${
                    isExpanded ? "rotate-90" : "rotate-0"
                  }`}
                  style={{
                    width: 0,
                    height: 0,
                    borderStyle: "solid",
                    borderWidth: "4px 0 4px 6px",
                    borderColor:
                      "transparent transparent transparent currentColor",
                  }}
                />
              </button>

              {/* Status dot */}
              <span
                className={`flex-shrink-0 w-2 h-2 rounded-full ${
                  node.status === "complete"
                    ? "bg-green-500"
                    : node.status === "in-progress"
                      ? "bg-blue-500 animate-pulse"
                      : "bg-gray-600"
                }`}
              />

              {/* Label */}
              <span
                onClick={() => {
                  onSelect(node.id);
                  if (hasChildren && !isExpanded) {
                    onToggle(node.id);
                  }
                }}
                className="truncate text-sm leading-tight select-none"
              >
                {node.id}. {node.label}
              </span>
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
              <MissionTree
                nodes={node.children!}
                selectedId={selectedId}
                expandedIds={expandedIds}
                onSelect={onSelect}
                onToggle={onToggle}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
