import { createCookieSessionStorage } from "react-router";
import type { AuthResponse } from "~/types/auth";

export type SessionData = {
  user: AuthResponse;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__session",
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: import.meta.env.PROD,
      secrets: [
        import.meta.env.VITE_SESSION_SECRET ?? "dra2-dev-session-secret",
      ],
    },
  });

export { getSession, commitSession, destroySession };
