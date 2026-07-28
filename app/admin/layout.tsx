"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide sidebar/header when on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0">
        <h2 className="text-xl font-bold text-red-500 mb-6">Imtiyaz Admin</h2>
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <Link href="/admin/dashboard" className="px-3 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white">Dashboard</Link>
          <Link href="/admin/articles" className="px-3 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white">Articles</Link>
          <Link href="/admin/articles/new" className="px-3 py-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white">+ New Article</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
