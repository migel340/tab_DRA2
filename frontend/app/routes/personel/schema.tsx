import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";
import { PersonelSchema } from "~/types/personel";

export const PersonelFilterSchema = BaseTableParamsSchema;

export type PersonelFilterParams = z.infer<typeof PersonelFilterSchema>;

export const PersonelResponseSchema =
  createPaginatedResponseSchema(PersonelSchema);

export type PersonelResponse = z.infer<typeof PersonelResponseSchema>;
