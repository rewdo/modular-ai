import { NextRequest, NextResponse } from "next/server";
import { mockAssets, mockSearchDocuments } from "@/lib/mock-data";
import type { SearchRequest, SearchResponse, SearchResult } from "@/types";

export async function POST(request: NextRequest) {
  const body: SearchRequest = await request.json();
  const { query, filters } = body;
  const startTime = Date.now();

  // Tokenise: split on spaces + Chinese/English punctuation
  const keywords = query
    .toLowerCase()
    .split(/[\s,，、。！？；：""''（）【】《》]+/)
    .filter((k) => k.length > 0);

  const results: SearchResult[] = [];

  for (const asset of mockAssets) {
    // Apply type filter if present
    if (filters?.assetType && asset.type !== filters.assetType) continue;
    if (filters?.visibility && asset.visibility !== filters.visibility) continue;
    if (filters?.sourceType && asset.sourceType !== filters.sourceType) continue;

    const searchDoc = mockSearchDocuments.find((d) => d.assetId === asset.id);
    const searchText = [
      asset.name,
      asset.description,
      ...asset.tags,
      searchDoc?.searchableText || "",
    ]
      .join(" ")
      .toLowerCase();

    // Calculate keyword match score
    let matchCount = 0;
    const highlights: string[] = [];
    for (const kw of keywords) {
      if (searchText.includes(kw)) {
        matchCount++;
        // Extract a snippet around the keyword
        const idx = searchText.indexOf(kw);
        const start = Math.max(0, idx - 20);
        const end = Math.min(searchText.length, idx + kw.length + 30);
        highlights.push("…" + searchText.slice(start, end) + "…");
      }
    }

    const relevanceScore =
      keywords.length > 0 ? matchCount / keywords.length : 0;

    if (filters?.minScore && relevanceScore < filters.minScore) continue;

    if (relevanceScore > 0) {
      results.push({
        asset,
        relevanceScore: Math.round(relevanceScore * 100) / 100,
        matchReason:
          matchCount >= keywords.length
            ? "高度匹配 — 所有关键词均命中"
            : matchCount >= keywords.length / 2
              ? "部分匹配 — 核心关键词已命中"
              : "模糊匹配 — 可能相关",
        matchHighlights: highlights.slice(0, 3),
      });
    }
  }

  // Sort by relevance descending
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  const top5 = results.slice(0, 5);

  return NextResponse.json({
    results: top5,
    suggestedNext:
      top5.length > 0
        ? { action: "fork", label: "建议 Fork 最匹配的资产开始复用" }
        : { action: "create", label: "未找到匹配资产，建议新建" },
    totalCount: results.length,
    queryTime: Date.now() - startTime,
  } satisfies SearchResponse);
}
