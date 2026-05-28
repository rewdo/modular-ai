"use client";

import Link from "next/link";
import { GitBranch, FlaskConical, Copy, ArrowRight } from "lucide-react";

const features = [
  {
    icon: GitBranch,
    title: "可视化版本管理",
    description:
      "Git 风格的分支与版本控制，完整追溯每一次 Prompt/Agent/Workflow 的变更历史，支持 diff 对比和一键回滚。",
  },
  {
    icon: FlaskConical,
    title: "AI 评测系统",
    description:
      "内置多维度评测框架，支持准确率、召回率、满意度等指标自动评分，每次版本发布前自动运行评测。",
  },
  {
    icon: Copy,
    title: "模板复用",
    description:
      "社区驱动的模板市场，一键 Fork 优质 Prompt/Agent/Workflow 模板，加速 AI 资产从实验到生产。",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="flex h-14 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🧩</span>
          <span className="text-lg font-bold text-gray-900">ModularAI</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            开始使用
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-24 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          ModularAI
        </h1>
        <p className="mt-4 text-xl font-semibold text-primary-600">
          AI 资产协作与版本管理平台
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">
          像管理代码一样管理你的 Prompt、Agent、Workflow
          和知识包。团队协作、版本追溯、自动化评测，一站式完成 AI
          资产的全生命周期管理。
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            开始使用
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/assets"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            浏览资产库
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} ModularAI. All rights reserved.
      </footer>
    </div>
  );
}
