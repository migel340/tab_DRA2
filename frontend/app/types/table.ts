import { z } from "zod";

export const BaseTableParamsSchema = z.object({
  orderBy: z.string().optional().nullable(),
  sort: z.enum(["asc", "desc"]).optional().nullable().default("asc"),
});

export const PagedTableParamsSchema = BaseTableParamsSchema.extend({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type BaseTableParams = z.infer<typeof BaseTableParamsSchema>;
export type PagedTableParams = z.infer<typeof PagedTableParamsSchema>;
