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
          🧩 ModularAI
        </h1>
        <p className="mt-4 text-xl font-semibold text-primary-600">
          让 AI 资产像代码一样版本化管理
        </p>

        {/* Smart Search Box */}
        <form
          className="mx-auto mt-8 max-w-2xl"
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.elements.namedItem("search") as HTMLInputElement).value;
            window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
          }}
        >
          <div className="flex items-center rounded-xl border border-gray-300 bg-white shadow-md transition-shadow focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200">
            <input
              name="search"
              type="text"
              placeholder="描述你的AI需求，找到最合适的Prompt、Agent或Workflow..."
              className="flex-1 border-none bg-transparent px-5 py-4 text-base text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="mr-2 flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
            >
              智能匹配
            </button>
          </div>
        </form>

        <div className="mt-6">
          <Link
            href="/assets"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            浏览模板库 →
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
