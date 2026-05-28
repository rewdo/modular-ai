import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ModularAI — AI 资产协作与版本管理平台",
  description:
    "像管理代码一样管理你的 Prompt、Agent、Workflow 和知识包。团队协作、版本追溯、自动化评测。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
