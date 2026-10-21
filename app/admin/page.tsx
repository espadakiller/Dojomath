import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="px-5 pt-36 pb-24">
      <AdminDashboard />
    </main>
  );
}
