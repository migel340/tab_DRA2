import * as z from "zod";

export const FilterSchema = z.object({
  q: z.string().catch(""),
  sortBy: z.string().catch("id"),
  order: z.enum(["asc", "desc"]).catch("asc"),
});

export type FilterValues = z.infer<typeof FilterSchema>;
