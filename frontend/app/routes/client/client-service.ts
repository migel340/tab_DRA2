import { clientApi } from "./client-api";
import { ClientSchema } from "~/types/client";
import type { Client } from "~/types/client";
import {
  ClientResponseSchema,
  type ClientFilterParams,
  type ClientResponse,
} from "./schema";

export const clientService = {
  getClientById: async (
    request: Request,
    id: number,
  ): Promise<Client | undefined> => {
    const raw = await clientApi.getOne(request, id);
    if (!raw) return undefined;

    return ClientSchema.parse(raw);
  },

  fetchClientList: async (
    request: Request,
    params: ClientFilterParams,
  ): Promise<ClientResponse> => {
    const result = await clientApi.getAll(params, request);

    return ClientResponseSchema.parse(result);
  },
};
