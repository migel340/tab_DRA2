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
      console.log(meta);
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
};
