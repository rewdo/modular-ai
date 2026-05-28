"use client";

import { Bell, Search } from "lucide-react";

export function Topbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex h-14 items-center border-b border-gray-200 bg-white px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl" role="img" aria-label="ModularAI">
          🧩
        </span>
        <span className="text-lg font-bold text-gray-900">ModularAI</span>
      </div>

      {/* Right: Actions */}
      <div className="ml-auto flex items-center gap-4">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-400">
          <Search className="h-4 w-4" />
          <span>搜索资产...</span>
          <kbd className="ml-4 rounded border border-gray-300 bg-white px-1.5 py-0 text-xs text-gray-400">
            /
          </kbd>
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label="通知"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* User Avatar */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-300 transition-colors"
          aria-label="用户菜单"
        >
          Q
        </button>
      </div>
    </header>
  );
}
