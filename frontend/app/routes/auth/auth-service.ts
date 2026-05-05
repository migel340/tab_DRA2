import { authApi } from "./auth-api";
import {
  AuthResponseSchema,
  type AuthResponse,
  type LoginData,
} from "~/types/auth";

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const raw = await authApi.login(data);
    return AuthResponseSchema.parse(raw);
  },
};
