import z, { ZodType } from "zod";
import type { BaseTableParams } from "./table";
import { BaseTableParamsSchema } from "./table";

export const BasePaginatedMetaSchema = BaseTableParamsSchema.extend({
  totalItems: z.number(),
  totalPages: z.number(),
});

export type BasePaginatedMeta = z.infer<typeof BasePaginatedMetaSchema>;

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
  params?: BaseTableParams;
}

export interface ApiPaginatedResponse<TData> {
  data: TData[];
  meta: BasePaginatedMeta;
}

export const createPaginatedResponseSchema = <T extends ZodType>(
  itemSchema: T,
) => {
  return z.object({
    data: z.array(itemSchema),
    meta: BasePaginatedMetaSchema,
  });
};

export type ApiResponse<T> = {
  data: T;
  errors?: string;
  message: string;
  success: boolean;
  timestamp: string;
};
