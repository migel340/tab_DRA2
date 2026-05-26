import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";
import {
  ClientListItemDbSchema,
  ClientListItemParser,
  ClientSchema,
} from "~/types/client";

export const ClientFilterSchema = BaseTableParamsSchema;

export type ClientFilterParams = z.infer<typeof ClientFilterSchema>;

export const ClientResponseSchema = createPaginatedResponseSchema(ClientSchema);

export type ClientResponse = z.infer<typeof ClientResponseSchema>;

export const ClientListDbResponseSchema = createPaginatedResponseSchema(
  ClientListItemDbSchema,
);

export type ClientListDbResponse = z.infer<typeof ClientListDbResponseSchema>;

export const ClientResponseFromDbSchema = ClientListDbResponseSchema.transform(
  (result) => ({
    data: result.data.map((client) => ClientListItemParser.parse(client)),
    meta: result.meta,
  }),
);
