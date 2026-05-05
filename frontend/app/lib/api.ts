import { z, ZodError } from "zod";
import { getToken, logout } from "~/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";
const DEFAULT_ERROR_MESSAGE = "Coś poszło nie tak. Spróbuj ponownie.";

const ApiErrorBodySchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

type ApiErrorBody = z.output<typeof ApiErrorBodySchema>;

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ApiRequestOptions extends RequestInit {
  withAuth?: boolean;
}

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
  const token = options.withAuth === false ? null : getToken();
  const headers = new Headers(options.headers);

  if (
    !headers.has("Content-Type") &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const raw = await safeParseJson(response);

  if (!response.ok) {
    const parsedBody = ApiErrorBodySchema.safeParse(raw);
    const body = parsedBody.success ? parsedBody.data : undefined;

    if (response.status === 401 && options.withAuth !== false) {
      logout();
    }

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
