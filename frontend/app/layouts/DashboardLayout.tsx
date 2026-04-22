import { Outlet } from "react-router";
import Sidebar from "~/components/layout/Sidebar";
import type { Role } from "~/types/auth";

export async function loader() {
  return {
    user: {
      id: 1,
      email: "user@gmail.com",
      role: "MANAGER" as Role,
    },
  };
}

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 shrink-0 border-r border-l-gray-200">
        <Sidebar />
      </aside>
      <main className="p-10">
        <Outlet />
      </main>
    </div>
  );
}
