import { Outlet, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Sidebar from "~/components/layout/Sidebar";
import { getUser, isAuthenticated } from "~/lib/auth";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) return null;

  const user = getUser();

  return (
    <div className="flex h-screen">
      <aside className="w-64 shrink-0 border-r border-border">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto my-3 mx-8">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
