"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Search,
  Sparkles,
  ArrowRight,
  ExternalLink,
  GitFork,
  Filter,
  X,
} from "lucide-react";
import type {
  SearchResponse,
  SearchResult,
  AssetType,
} from "@/types";
import { getAssetTypeLabel, typeColors } from "@/types";

const typeAllOptions: { label: string; value: AssetType | "all" }[] = [
  { label: "全部类型", value: "all" },
  { label: "Prompt", value: "prompt" },
  { label: "Agent", value: "agent" },
  { label: "Workflow", value: "workflow" },
  { label: "Knowledge Pack", value: "knowledge_pack" },
];

function ScoreBadge({ score }: { score: number }) {
  let color: string;
  if (score >= 0.8) color = "bg-green-100 text-green-700";
  else if (score >= 0.5) color = "bg-yellow-100 text-yellow-700";
  else color = "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${color}`}
    >
      {Math.round(score * 100)}%
    </span>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q,
            workspaceId: "ws-001",
            mode: "keyword",
            filters:
              typeFilter !== "all"
                ? { assetType: typeFilter }
                : undefined,
          }),
        });
        if (!res.ok) throw new Error("搜索请求失败");
        const data: SearchResponse = await res.json();
        setResults(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "搜索出错");
      } finally {
        setLoading(false);
      }
    },
    [typeFilter]
  );

  // Auto-search on mount if query parameter present
  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`, {
      scroll: false,
    });
    doSearch(query.trim());
  };

  const clearSearch = () => {
    setQuery("");
    setResults(null);
    router.push("/search", { scroll: false });
  };

  const resultCount =
    results?.totalCount != null ? results.totalCount : 0;
  const showStartScreen = !results && !loading && !error;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Search Box */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <div className="relative flex items-center rounded-xl border border-gray-300 bg-white shadow-sm transition-shadow focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500">
              <Search className="ml-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="用一句话描述你的需求，例如：我想找一个处理退款和发货延迟的客服 prompt"
                className="flex-1 border-none bg-transparent px-3 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mr-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`mr-2 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 ${
                  showFilters ? "bg-gray-100 text-primary-600" : ""
                }`}
              >
                <Filter className="h-4 w-4" />
              </button>
              <button
                type="submit"
                className="mr-2 flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                智能匹配
              </button>
            </div>

            {/* Filter bar */}
            {showFilters && (
              <div className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  筛选
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as AssetType | "all")
                  }
                  className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-primary-500 focus:outline-none"
                >
                  {typeAllOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </form>

        {/* Start Screen */}
        {showStartScreen && (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto mb-4 h-10 w-10 text-gray-300" />
            <p className="text-base font-medium text-gray-500">
              输入需求描述，智能发现可复用的 AI 资产
            </p>
            <p className="mt-1 text-sm text-gray-400">
              支持 Prompt、Agent、Workflow、知识包等资产类型
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <EmptyState
            icon={X}
            title="搜索出错"
            description={error}
          />
        )}

        {/* Results */}
        {results && !loading && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                找到{" "}
                <span className="font-semibold text-gray-900">
                  {resultCount}
                </span>{" "}
                个匹配资产
              </span>
              <span className="text-gray-300">·</span>
              <span>耗时 {results.queryTime}ms</span>
              {resultCount === 0 && (
                <button
                  className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700 transition-colors"
                >
                  建议新建资产
                </button>
              )}
            </div>

            {/* Result cards */}
            {results.results.map((r: SearchResult) => (
              <Card key={r.asset.id} hover>
                <div
                  className="p-5 cursor-pointer"
                  onClick={() =>
                    router.push(`/assets/${r.asset.id}`)
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Title row */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {r.asset.name}
                        </h3>
                        <Badge
                          variant={typeColors[r.asset.type as AssetType]}
                        >
                          {getAssetTypeLabel(r.asset.type)}
                        </Badge>
                        <ScoreBadge score={r.relevanceScore} />
                      </div>

                      {/* Match reason */}
                      <p className="text-xs text-gray-500">
                        {r.matchReason}
                      </p>

                      {/* Highlights */}
                      {r.matchHighlights.length > 0 && (
                        <div className="space-y-1">
                          {r.matchHighlights.map((hl: string, i: number) => (
                            <p
                              key={i}
                              className="text-xs text-gray-500 bg-gray-50 rounded-md px-3 py-1.5 font-mono line-clamp-1"
                            >
                              {hl}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      {r.asset.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {r.asset.tags.map((tag: string) => (
                            <Badge key={tag} variant="default">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/assets/${r.asset.id}`);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        查看详情
                        <ExternalLink className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Fork action — placeholder
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 transition-colors"
                      >
                        Fork
                        <GitFork className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            {/* Suggested next */}
            {results.results.length > 0 && (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <p className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="h-4 w-4 text-primary-500" />
                  {results.suggestedNext.label}
                  <ArrowRight className="h-4 w-4" />
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
