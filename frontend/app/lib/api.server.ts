import { ZodError } from "zod";
import { logoutUser, requireUser } from "~/lib/auth.server";
import {
  ApiError,
  ApiErrorBodySchema,
  type ApiErrorBody,
  type ApiRequestOptions,
  type ApiResponse,
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

async function safeParseJson<T>(
  response: Response,
): Promise<unknown | undefined> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

export async function api<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
  request?: Request,
): Promise<T> {
  const headers = new Headers(options.headers);
  const queryString = options.params ? stringifyParams(options.params) : "";
  if (
    !headers.has("Content-Type") &&
    options.body &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (request) {
    const user = await requireUser(request);
    if (user) {
      headers.set("Authorization", `Bearer ${user.token}`);
    }
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}${queryString ? "?" + queryString : ""}`,
    {
      ...options,
      headers,
    },
  );

  const raw = await safeParseJson(response);

  if (!response.ok) {
    const parsedBody = ApiErrorBodySchema.safeParse(raw ?? {});
    const body = parsedBody.success ? parsedBody.data : undefined;

    if (response.status === 401 && request) {
      throw await logoutUser(request);
    }

    throw new ApiError(
      getApiErrorMessage(response.status, body),
      response.status,
      body?.errors,
    );
  }

  if (!raw) {
    throw new ApiError(DEFAULT_ERROR_MESSAGE, response.status);
  }

  const apiResp = raw as ApiResponse<T>;

  if (typeof apiResp.success === "boolean") {
    if (!apiResp.success) {
      throw new ApiError(
        apiResp.message ?? DEFAULT_ERROR_MESSAGE,
        response.status,
      );
    }

    return apiResp.data as T;
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

const stringifyParams = (params: Record<string, any>): string => {
  const clean = Object.entries(params)
    .filter(([_, v]) => v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: String(v) }), {});

  return new URLSearchParams(clean).toString();
};
