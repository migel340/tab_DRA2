import { api } from "~/lib/api.server";
import type { ClientDB } from "~/types/client";
import type { ClientFilterParams, ClientResponse } from "./schema";
import { MOCK_CLIENTS, filterMockClients } from "~/mocks/client";

const ENDPOINT = "/clients";

// Toggle mock data: set to false when backend API is ready
const USE_MOCK_DATA = true;

export const clientApi = {
  getOne: async (request: Request, id: number) => {
    if (USE_MOCK_DATA) {
      const client = MOCK_CLIENTS.find((c) => c.id === id);
      return client || null;
    }

    return api<ClientDB>(
      ENDPOINT + `/${id}`,
      {
        method: "GET",
      },
      request,
    );
  },

  getAll: async (params: ClientFilterParams, request: Request) => {
    if (USE_MOCK_DATA) {
      const limit = params.limit ? parseInt(String(params.limit)) : 10;
      const page = params.page ? parseInt(String(params.page)) : 1;
      const offset = (page - 1) * limit;
      const query = params.q ? String(params.q) : undefined;

      const result = filterMockClients(query, limit, offset);

      const meta = {
        ...result.meta,
        sort: params.sort,
        orderBy: params.orderBy,
      };
      return {
        data: result.data,
        meta: meta,
      } as ClientResponse;
    }

    return api<ClientResponse>(
      ENDPOINT,
      {
        method: "GET",
        params: params,
      },
      request,
    );
  },

  create: async (payload: Omit<ClientDB, "id">, request: Request) => {
    if (USE_MOCK_DATA) {
      const nextId =
        MOCK_CLIENTS.length > 0
          ? Math.max(...MOCK_CLIENTS.map((client) => client.id)) + 1
          : 1;

      const created: ClientDB = {
        id: nextId,
        ...payload,
      };

      MOCK_CLIENTS.push(created);
      return created;
    }

    return api<ClientDB>(
      ENDPOINT,
      { method: "POST", body: JSON.stringify(payload) },
      request,
    );
  },

  update: async (id: number, payload: Partial<ClientDB>, request: Request) => {
    if (USE_MOCK_DATA) {
      const existingIndex = MOCK_CLIENTS.findIndex(
        (client) => client.id === id,
      );

      if (existingIndex === -1) {
        throw new Error("Client not found");
      }

      const updated: ClientDB = {
        ...MOCK_CLIENTS[existingIndex],
        ...payload,
        id,
      };

      MOCK_CLIENTS[existingIndex] = updated;
      return updated;
    }

    return api<ClientDB>(
      ENDPOINT + `/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      request,
    );
  },
};
