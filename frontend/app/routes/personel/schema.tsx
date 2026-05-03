import * as z from "zod";
import { BaseTableParamsSchema } from "~/types/table";

export const PersonelFilterSchema = BaseTableParamsSchema.extend({
  q: z.string().optional(),
});

export type PersonelFilterParams = z.infer<typeof PersonelFilterSchema>;
