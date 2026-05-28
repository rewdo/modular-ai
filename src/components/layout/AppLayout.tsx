"use client";

import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { usePathname } from "next/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <Sidebar currentPath={pathname} />
      <main className="ml-56 pt-14">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
