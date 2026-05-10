import { api } from "~/lib/api.server";
import type { LoginData, AuthResponse } from "~/types/auth";

export const authApi = {
  login: async (payload: LoginData): Promise<AuthResponse> => {
    return api<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      withAuth: false,
    });
  },
};

export const login = authApi.login;
