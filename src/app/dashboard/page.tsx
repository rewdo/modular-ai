"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  LayoutDashboard,
  GitBranch,
  GitMerge,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  mockDashboardStats,
  mockAssets,
  mockEvalRuns,
} from "@/lib/mock-data";
import { getAssetTypeLabel, timeAgo, typeColors } from "@/types";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = mockDashboardStats;

  const statCards = [
    {
      label: "资产总数",
      value: stats.totalAssets,
      icon: LayoutDashboard,
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      label: "本周新增版本",
      value: stats.newVersionsThisWeek,
      icon: GitBranch,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "待审核 MR",
      value: stats.pendingMRs,
      icon: GitMerge,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "本周测试成本",
      value: `$${stats.weeklyCost.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // Recent 5 updated assets
  const recentUpdates = [...mockAssets]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  // Recent 5 eval runs
  const recentEvals = [...mockEvalRuns]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  function getAssetName(id: string): string {
    return mockAssets.find((a) => a.id === id)?.name ?? id;
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            if (loading) {
              return (
                <Card key={stat.label}>
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </Card>
              );
            }
            return (
              <Card key={stat.label}>
                <div className="flex items-start justify-between p-5">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-lg ${stat.bg} p-2.5`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Two-column content */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Updates */}
          <Card>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <Clock className="h-4 w-4 text-gray-400" />
                最近更新
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))
                : recentUpdates.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate font-medium text-gray-900">
                          {item.name}
                        </span>
                        <Badge variant={typeColors[item.type]}>
                          {getAssetTypeLabel(item.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-gray-400 flex-shrink-0">
                        <span className="text-xs">
                          v{item.currentVersion.versionNumber}
                        </span>
                        <span className="text-xs">
                          {timeAgo(item.updatedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </Card>

          {/* Recent Evaluations */}
          <Card>
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <TrendingUp className="h-4 w-4 text-gray-400" />
                最近评测结果
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3">
                      <Skeleton className="h-4 flex-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))
                : recentEvals.map((ev) => (
                    <div
                      key={ev.id}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {getAssetName(ev.assetVersionId)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {ev.summary
                            ? ev.summary.split("。")[0]
                            : `评分 ${ev.avgScore}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            ev.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {ev.status === "completed" ? "完成" : ev.status}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {ev.avgScore}%
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
