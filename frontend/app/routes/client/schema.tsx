import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";
import { ClientSchema } from "~/types/client";

export const ClientFilterSchema = BaseTableParamsSchema;

export type ClientFilterParams = z.infer<typeof ClientFilterSchema>;

export const ClientResponseSchema =
  createPaginatedResponseSchema(ClientSchema);

export type ClientResponse = z.infer<typeof ClientResponseSchema>;
