"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Plus, Upload, FolderOpen } from "lucide-react";
import { mockAssets } from "@/lib/mock-data";
import { formatDate, getAssetTypeLabel, typeColors, type AssetType } from "@/types";

const typeAllOptions = [
  { label: "全部", value: "all" },
  { label: "Prompt", value: "prompt" },
  { label: "Agent", value: "agent" },
  { label: "Workflow", value: "workflow" },
  { label: "Knowledge Pack", value: "knowledge_pack" },
];

export default function AssetsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [tagFilter, setTagFilter] = useState("");

  const allTags = Array.from(
    new Set(mockAssets.flatMap((a) => a.tags))
  );

  const filtered = mockAssets.filter((asset) => {
    if (typeFilter !== "all" && asset.type !== typeFilter) return false;
    if (search && !asset.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (tagFilter && !asset.tags.includes(tagFilter)) return false;
    return true;
  });

  if (mockAssets.length === 0) {
    return (
      <AppLayout>
        <EmptyState
          icon={FolderOpen}
          title="还没有资产"
          description="创建第一个 AI 资产，开始管理你的 Prompt、Agent、Workflow 和知识包。"
          action={{ label: "新建资产", onClick: () => {} }}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">资产库</h1>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4" />
              导入
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
              <Plus className="h-4 w-4" />
              新建资产
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索资产名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-4 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as AssetType | "all")
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {typeAllOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">全部标签</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {filtered.length > 0 && (
            <span className="text-sm text-gray-400">
              共 {filtered.length} 个资产
            </span>
          )}
        </div>

        {/* Asset Cards */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="没有匹配的资产"
            description="尝试调整搜索条件或筛选器"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((asset) => (
              <Card
                key={asset.id}
                hover
                onClick={() => router.push(`/assets/${asset.id}`)}
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">
                      {asset.name}
                    </h3>
                    <Badge variant={typeColors[asset.type]}>
                      {getAssetTypeLabel(asset.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">
                    v{asset.currentVersion.versionNumber} ·{" "}
                    {formatDate(asset.updatedAt)}
                  </p>
                  {asset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {asset.tags.map((tag) => (
                        <Badge key={tag} variant="default">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
