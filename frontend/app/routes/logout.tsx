import type { Route } from "./+types/logout";
import { logoutUser } from "~/lib/auth.server";

export async function action({ request }: Route.ActionArgs) {
  return logoutUser(request);
}

export default function LogoutRoute() {
  return null;
}
