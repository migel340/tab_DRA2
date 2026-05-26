import { Outlet, redirect } from "react-router";
import Sidebar from "~/components/Sidebar";
import type { Route } from "./+types/DashboardLayout";
import { getUserFromRequest } from "~/lib/auth.server";
import { userContext } from "~/context";

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  return { user };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;

  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="w-64 shrink-0 border-r border-border">
        <Sidebar user={user} />
      </aside>
      <main className="min-h-0 flex-1 overflow-auto overscroll-contain py-3 mx-8">
        <Outlet context={{ user }} />
      </main>
    </div>
  );
}

async function authMiddleware({ request, context }: Route.LoaderArgs) {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw redirect("/login");
  }
  context.set(userContext, user);
}

export const middleware: Route.MiddlewareFunction[] = [authMiddleware];
