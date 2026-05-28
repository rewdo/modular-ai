"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import {
  Pencil,
  GitBranch,
  GitFork,
  CheckCircle2,
  Circle,
  ArrowLeftRight,
  RotateCcw,
  Clock,
  ExternalLink,
  MessageSquare,
  Package,
  FlaskConical,
  Activity,
} from "lucide-react";
import {
  mockAssets,
  mockVersions,
  mockMergeRequests,
  mockEvalRuns,
  mockActivities,
} from "@/lib/mock-data";
import {
  formatDate,
  timeAgo,
  getAssetTypeLabel,
  typeColors,
  type AssetType,
} from "@/types";

const tabDefs = [
  { key: "overview", label: "Overview" },
  { key: "versions", label: "Versions" },
  { key: "branches", label: "Branches" },
  { key: "evaluations", label: "Evaluations" },
  { key: "activity", label: "Activity" },
];

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const asset = mockAssets.find((a) => a.id === id);

  const tabFromUrl = searchParams.get("tab") ?? "overview";
  const validTabs = tabDefs.map((t) => t.key);
  const activeTab = validTabs.includes(tabFromUrl) ? tabFromUrl : "overview";

  const setTab = (key: string) => {
    router.push(`/assets/${id}?tab=${key}`, { scroll: false });
  };

  if (!asset) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">资产不存在</p>
            <p className="mt-1 text-sm text-gray-500">
              未找到 ID 为 {id} 的资产
            </p>
            <button
              onClick={() => router.push("/assets")}
              className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
            >
              返回资产库
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Derived data for this asset
  const versions = mockVersions.filter((v) => v.assetId === asset.id);
  const branches = Array.from(
    new Set(versions.map((v) => v.branchName).filter((b) => b !== "main"))
  );
  const evals = mockEvalRuns.filter((run) =>
    versions.some((v) => v.id === run.assetVersionId)
  );
  const activities = mockActivities.filter((act) => act.entityId === asset.id);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {asset.name}
              </h1>
              <Badge variant={typeColors[asset.type]}>
                {getAssetTypeLabel(asset.type)}
              </Badge>
              <span className="text-sm text-gray-400">
                v{asset.currentVersion.versionNumber}
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-2xl">
              {asset.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Pencil className="h-4 w-4" />
              编辑
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
              <GitBranch className="h-4 w-4" />
              新建版本
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <GitFork className="h-4 w-4" />
              Fork
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabDefs.map((t) => ({
            ...t,
            count:
              t.key === "versions"
                ? versions.length
                : t.key === "branches"
                  ? branches.length
                  : t.key === "evaluations"
                    ? evals.length
                    : t.key === "activity"
                      ? activities.length
                      : undefined,
          }))}
          activeKey={activeTab}
          onChange={setTab}
        />

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === "overview" && <OverviewTab asset={asset} />}
          {activeTab === "versions" && (
            <VersionsTab asset={asset} versions={versions} />
          )}
          {activeTab === "branches" && (
            <BranchesTab branches={branches} versions={versions} />
          )}
          {activeTab === "evaluations" && <EvaluationsTab evals={evals} />}
          {activeTab === "activity" && (
            <ActivityTab activities={activities} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

/* ---- Sub-components ---- */

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 text-sm">
      <span className="text-gray-400 min-w-[80px]">{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}

function OverviewTab({ asset }: { asset: ReturnType<() => import("@/lib/mock-data")["mockAssets"][number]> }) {
  const router = useRouter();
  const userMap: Record<string, string> = {
    "u-001": "张明",
    "u-002": "李雪",
    "u-003": "王磊",
    "u-004": "陈芳",
    "u-005": "赵刚",
  };

  const sourceLabels: Record<string, string> = {
    manual: "手动创建",
    dify: "Dify 平台",
    coze: "Coze 平台",
    n8n: "n8n 平台",
    import_file: "文件导入",
  };

  const versions = mockVersions.filter((v) => v.assetId === asset.id);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Config */}
      <Card className="lg:col-span-2 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-900">配置摘要</h3>
        <pre className="rounded-lg bg-gray-50 p-4 text-xs text-gray-700 overflow-x-auto font-mono leading-relaxed max-h-96 overflow-y-auto">
          {JSON.stringify(asset.content, null, 2)}
        </pre>
      </Card>

      {/* Meta Sidebar */}
      <div className="space-y-4">
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">基本信息</h3>
          <MetaRow label="创建者" value={userMap[asset.createdBy] ?? asset.createdBy} />
          <MetaRow label="创建时间" value={formatDate(asset.createdAt)} />
          <MetaRow label="更新时间" value={formatDate(asset.updatedAt)} />
          <MetaRow label="来源" value={sourceLabels[asset.sourceType] ?? asset.sourceType} />
          <MetaRow label="可见性" value={asset.visibility === "public" ? "公开" : asset.visibility === "workspace" ? "工作区" : "私有"} />
        </Card>

        {/* Tags */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">标签</h3>
          <div className="flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">统计</h3>
          <MetaRow label="版本数" value={String(versions.length)} />
          <MetaRow
            label="评测次数"
            value={String(
              mockEvalRuns.filter((r) =>
                versions.some((v) => v.id === r.assetVersionId)
              ).length
            )}
          />
        </Card>

        {/* Source metadata */}
        {asset.sourceMetadata && (
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">来源信息</h3>
            <pre className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 overflow-x-auto font-mono leading-relaxed">
              {JSON.stringify(asset.sourceMetadata, null, 2)}
            </pre>
          </Card>
        )}
      </div>

      {/* Similar Assets */}
      <SimilarAssets currentAsset={asset} />
    </div>
  );
}

/** Recommend assets that share tags with the current asset */
function SimilarAssets({
  currentAsset,
}: {
  currentAsset: ReturnType<() => import("@/lib/mock-data")["mockAssets"][number]>;
}) {
  const router = useRouter();
  const similar = mockAssets
    .filter(
      (a) =>
        a.id !== currentAsset.id &&
        a.tags.some((t) => currentAsset.tags.includes(t))
    )
    .slice(0, 3);

  if (similar.length === 0) return null;

  return (
    <div className="lg:col-span-3 mt-4">
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          相似资产推荐
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {similar.map((a) => (
            <div
              key={a.id}
              onClick={() => router.push(`/assets/${a.id}`)}
              className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {a.name}
                </span>
                <Badge variant={typeColors[a.type]}>
                  {getAssetTypeLabel(a.type)}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">
                {a.description}
              </p>
              {a.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                  {a.tags.length > 2 && (
                    <span className="text-xs text-gray-400">
                      +{a.tags.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function VersionsTab({
  asset,
  versions,
}: {
  asset: ReturnType<() => import("@/lib/mock-data")["mockAssets"][number]>;
  versions: ReturnType<() => import("@/lib/mock-data")["mockVersions"]>;
}) {
  const userMap: Record<string, string> = {
    "u-001": "张明",
    "u-002": "李雪",
    "u-003": "王磊",
    "u-004": "陈芳",
    "u-005": "赵刚",
  };

  // Sort by version number descending
  const sorted = [...versions].sort(
    (a, b) => b.versionNumber - a.versionNumber
  );

  if (sorted.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center text-sm text-gray-400">
          暂无版本记录
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((v, idx) => (
        <Card key={v.id}>
          <div className="flex items-start justify-between p-5">
            <div className="flex items-start gap-4">
              {/* Timeline connector */}
              <div className="flex flex-col items-center pt-1">
                {v.isStable ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
                {idx < sorted.length - 1 && (
                  <div className="mt-1 h-full w-0.5 bg-gray-200" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    v{v.versionNumber}
                  </span>
                  {v.isStable && <Badge variant="success">stable</Badge>}
                </div>
                <p className="text-sm text-gray-600">{v.changeSummary}</p>
                {v.aiChangeSummary && (
                  <p className="text-xs text-gray-400 italic">
                    AI: {v.aiChangeSummary}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(v.createdAt)}
                  </span>
                  <span>{userMap[v.createdBy] ?? v.createdBy}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <ArrowLeftRight className="h-3 w-3" />
                对比
              </button>
              <button className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                <RotateCcw className="h-3 w-3" />
                回滚
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function BranchesTab({
  branches,
  versions,
}: {
  branches: string[];
  versions: ReturnType<() => import("@/lib/mock-data")["mockVersions"]>;
}) {
  if (branches.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center text-sm text-gray-400">
          暂无分支
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {branches.map((b) => {
        const branchVer = versions.find((v) => v.branchName === b);
        return (
          <Card key={b}>
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-gray-400" />
                <span className="font-mono text-sm font-medium text-gray-900">
                  {b}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                最新版本 v{branchVer?.versionNumber ?? "?"} ·{" "}
                {branchVer ? formatDate(branchVer.createdAt) : ""}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function EvaluationsTab({
  evals,
}: {
  evals: ReturnType<() => import("@/lib/mock-data")["mockEvalRuns"]>;
}) {
  if (evals.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center text-sm text-gray-400">
          暂无评测记录
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {evals.map((ev) => (
        <Card key={ev.id}>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">
                Run {ev.id}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  ev.status === "completed"
                    ? "bg-green-50 text-green-700"
                    : ev.status === "failed"
                      ? "bg-red-50 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {ev.status === "completed"
                  ? "通过"
                  : ev.status === "failed"
                    ? "失败"
                    : "进行中"}
              </span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {ev.avgScore}
              </span>
              <span className="text-sm text-gray-400">
                / 100 · ${ev.avgCost.toFixed(4)} · {ev.avgLatency}ms
              </span>
            </div>
            {ev.summary && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {ev.summary}
              </p>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <FlaskConical className="h-3 w-3" />
              {formatDate(ev.createdAt)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ActivityTab({
  activities,
}: {
  activities: ReturnType<() => import("@/lib/mock-data")["mockActivities"]>;
}) {
  if (activities.length === 0) {
    return (
      <Card>
        <div className="p-12 text-center text-sm text-gray-400">
          暂无活动记录
        </div>
      </Card>
    );
  }

  const typeIcons: Record<string, React.ElementType> = {
    "version.create": Package,
    "eval.run": FlaskConical,
    "mr.create": GitBranch,
    "mr.merge": GitBranch,
    "asset.create": Package,
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <div className="divide-y divide-gray-100">
          {activities.map((log) => {
            const Icon = typeIcons[log.actionType] ?? Activity;
            return (
              <div key={log.id} className="flex gap-3 p-4">
                <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{log.actorName}</span>{" "}
                    {log.actionLabel}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {timeAgo(log.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
