import { redirect } from "react-router";
import type { Route } from "./+types/DashboardGuard";
import { userContext } from "~/context";

export function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);

  if (user.role === "ADMIN") {
    throw redirect("/personel");
  }

  if (user.role === "MANAGER") {
    throw redirect("/requests");
  }

  throw redirect("/logout");
}
