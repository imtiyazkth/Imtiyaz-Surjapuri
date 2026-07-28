"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-xs text-slate-400">Welcome back, Md Imtiyaz Alam</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <h3 className="text-xs font-semibold text-slate-400 uppercase">Quick Action</h3>
          <Link href="/admin/articles/new" className="inline-block mt-3 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700">
            + Write New Article
          </Link>
        </div>
      </div>
    </div>
  );
}
