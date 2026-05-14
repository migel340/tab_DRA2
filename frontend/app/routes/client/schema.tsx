import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";
import { ClientDbSchema, ClientSchema } from "~/types/client";

export const ClientFilterSchema = BaseTableParamsSchema;

export type ClientFilterParams = z.infer<typeof ClientFilterSchema>;

export const ClientResponseSchema = createPaginatedResponseSchema(ClientSchema);

export type ClientResponse = z.infer<typeof ClientResponseSchema>;

export const ClientDbResponseSchema =
  createPaginatedResponseSchema(ClientDbSchema);

export type ClientDbResponse = z.infer<typeof ClientDbResponseSchema>;

export const ClientResponseFromDbSchema = ClientDbResponseSchema.transform(
  (result) => ({
    data: result.data.map((client) => ClientSchema.parse(client)),
    meta: result.meta,
  }),
);
