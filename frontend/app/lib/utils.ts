import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const shouldSkipAuth = (): boolean => {
  if (import.meta.env.PROD) return false;

  const isAuthDisabledInEnv = import.meta.env.VITE_ENABLE_AUTH_DEV === "false";

  return isAuthDisabledInEnv;
};

export function buildUrl(
  basePath: string,
  params?: Record<string, any>,
): string {
  if (!params) return basePath;

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
