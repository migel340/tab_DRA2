import z from "zod";

export const ApiErrorBodySchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
});

export type ApiErrorBody = z.output<typeof ApiErrorBodySchema>;

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

export interface ApiRequestOptions extends RequestInit {
  withAuth?: boolean;
}
