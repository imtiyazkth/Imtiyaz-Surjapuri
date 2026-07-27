import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--surface-bg)" }}>
      <AdminSidebar />
      <div className="admin-main">
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
