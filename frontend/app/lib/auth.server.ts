import { redirect } from "react-router";
import {
  commitSession,
  destroySession,
  getSession,
} from "~/lib/sessions.server";
import type { AuthResponse, UserRole } from "~/types/auth";

const AUTH_SESSION_KEY = "user";

export async function getUserFromRequest(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get(AUTH_SESSION_KEY) as AuthResponse | undefined;
}

export async function requireUser(request: Request): Promise<AuthResponse> {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

export async function requireRole(
  request: Request,
  allowedRoles: UserRole[],
): Promise<AuthResponse> {
  const user = await requireUser(request);
  if (!allowedRoles.includes(user.role)) {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}

export async function requireAdmin(request: Request): Promise<AuthResponse> {
  return requireRole(request, ["ADMIN"]);
}

export async function requireManager(request: Request): Promise<AuthResponse> {
  return requireRole(request, ["MANAGER", "ADMIN"]);
}

export async function createUserSession(user: AuthResponse, redirectTo = "/") {
  const session = await getSession();
  session.set(AUTH_SESSION_KEY, user);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function logoutUser(request: Request, redirectTo = "/login") {
  const session = await getSession(request.headers.get("Cookie"));

  throw redirect(redirectTo, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
