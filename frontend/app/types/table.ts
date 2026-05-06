import { z } from "zod";

export const BaseTableParamsSchema = z.object({
  q: z.string().optional().nullable(),
  orderBy: z.string().optional().nullable(),
  sort: z.enum(["asc", "desc"]).optional().nullable().default("asc"),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export type BaseTableParams = z.infer<typeof BaseTableParamsSchema>;
