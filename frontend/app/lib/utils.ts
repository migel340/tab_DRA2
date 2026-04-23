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
