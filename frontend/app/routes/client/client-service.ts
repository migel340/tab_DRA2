import { clientApi } from "./client-api";
import { ClientSchema } from "~/types/client";
import type {
  Client,
  ClientCreatePayload,
  ClientUpdatePayload,
} from "~/types/client";
import {
  ClientResponseFromDbSchema,
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

    return ClientResponseFromDbSchema.parse(result);
  },

  createClient: async (
    data: ClientCreatePayload,
    request: Request,
  ): Promise<Client> => {
    const createdRaw = await clientApi.create(data, request);
    return ClientSchema.parse(createdRaw);
  },

  updateClient: async (
    id: number,
    data: ClientUpdatePayload,
    request: Request,
  ): Promise<Client> => {
    const { id: _id, ...dbPayload } = data;

    const updatedRaw = await clientApi.update(id, dbPayload, request);
    return ClientSchema.parse(updatedRaw);
  },
};
