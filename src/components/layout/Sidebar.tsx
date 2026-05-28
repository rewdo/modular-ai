"use client";

import {
  LayoutDashboard,
  FolderOpen,
  BarChart3,
  GitMerge,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Assets", path: "/assets", icon: FolderOpen },
  { label: "Evaluations", path: "/evaluations", icon: BarChart3 },
  { label: "Merge Requests", path: "/merge-requests", icon: GitMerge },
  { label: "Members", path: "/members", icon: Users },
  { label: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  currentPath: string;
}

export function Sidebar({ currentPath }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-14 z-20 flex h-[calc(100vh-3.5rem)] w-56 flex-col border-r border-gray-200 bg-white">
      {/* Workspace Name */}
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-100 text-xs font-bold text-primary-700">
            M
          </div>
          <span className="text-sm font-semibold text-gray-900">
            modulai-demo
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== "/dashboard" && currentPath.startsWith(item.path));
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 px-3 py-3">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
          v0.1.0
        </div>
      </div>
    </aside>
  );
}
