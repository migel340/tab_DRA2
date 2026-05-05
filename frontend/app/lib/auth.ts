import { MOCK_USER } from "~/mocks/auth";
import { shouldSkipAuth } from "./utils";
import type { AuthResponse, User } from "~/types/auth";

const TOKEN_KEY = "dra2_token";
const USER_KEY = "dra2_user";

const skipAuth = shouldSkipAuth();

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
  if (skipAuth) {
    return MOCK_USER;
  }
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  if (skipAuth) {
    return true;
  }
  return !!getToken();
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
