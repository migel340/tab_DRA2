import { z, ZodError } from "zod";
import {
  ApiError,
  ApiErrorBodySchema,
  type ApiErrorBody,
  type ApiRequestOptions,
} from "~/types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
const DEFAULT_ERROR_MESSAGE = "Coś poszło nie tak. Spróbuj ponownie.";

function getApiErrorMessage(status: number, body?: ApiErrorBody): string {
  if (body?.message) return body.message;
  if (body?.error) return body.error;
  if (status === 401) return "Sesja wygasła. Zaloguj się ponownie.";
  if (status === 403) return "Nie masz uprawnień do tej akcji.";
  if (status === 404) return "Nie znaleziono zasobu.";
  return DEFAULT_ERROR_MESSAGE;
}

async function safeParseJson(response: Response): Promise<unknown | undefined> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function api<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (
    !headers.has("Content-Type") &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const raw = await safeParseJson(response);

  if (!response.ok) {
    const parsedBody = ApiErrorBodySchema.safeParse(raw);
    const body = parsedBody.success ? parsedBody.data : undefined;

    throw new ApiError(
      getApiErrorMessage(response.status, body),
      response.status,
      body?.errors,
    );
  }

  return raw as T;
}

export function getUserErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Niepoprawne dane wejściowe.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}
