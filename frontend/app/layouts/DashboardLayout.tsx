import { Outlet, redirect } from "react-router";
import Sidebar from "~/components/Sidebar";
import type { Route } from "./+types/DashboardLayout";
import { getUserFromRequest } from "~/lib/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getUserFromRequest(request);

  if (!user) {
    throw redirect("/login");
  }

  return { user };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex h-screen">
      <aside className="w-64 shrink-0 border-r border-border">
        <Sidebar user={user} />
      </aside>
      <main className="flex-1 overflow-auto my-3 mx-8">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}
