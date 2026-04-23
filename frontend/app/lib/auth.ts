import type { AuthResponse } from "./api";

const TOKEN_KEY = "dra2_token";
const USER_KEY = "dra2_user";

export function saveAuth(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      surname: data.surname,
      role: data.role,
    }),
  );
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as {
      id: number;
      username: string;
      firstName: string;
      surname: string;
      role: "ADMIN" | "MANAGER" | "STAFF";
    };
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
