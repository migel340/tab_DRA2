import { api } from "~/lib/api.server";
import type {
  ClientCreatePayload,
  ClientDetailDB,
  ClientUpdatePayload,
} from "~/types/client";
import type { ClientResponse, ClientFilterParams } from "./schema";
import { MOCK_CLIENTS, filterMockClients } from "~/mocks/client";

const ENDPOINT = "/clients";

// Toggle mock data: set to false when backend API is ready
const USE_MOCK_DATA = false;

export const clientApi = {
  getOne: async (request: Request, id: number) => {
    if (USE_MOCK_DATA) {
      const client = MOCK_CLIENTS.find((c) => c.id === id);
      return client || null;
    }

    return api<ClientDetailDB>(
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
      };
    }

    return api<{
      data: ClientDetailDB[];
      meta: any;
    }>(
      ENDPOINT,
      {
        method: "GET",
        params: params,
      },
      request,
    );
  },

  create: async (payload: ClientCreatePayload, request: Request) => {
    if (USE_MOCK_DATA) {
      const nextId =
        MOCK_CLIENTS.length > 0
          ? Math.max(...MOCK_CLIENTS.map((client) => client.id)) + 1
          : 1;

      const { address } = payload;

      const createdDb: ClientDetailDB = {
        id: nextId,
        surname: payload.surname,
        firstName: payload.firstName,
        secondName: payload.secondName,
        phoneNumber: payload.phoneNumber,
        birthDate: payload.birthDate,
        address: address,
        addressId: 1,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        deviceId: 0,
        device_count: 0,
      };

      MOCK_CLIENTS.push(createdDb);
      return createdDb;
    }

    return api<ClientDetailDB>(
      ENDPOINT,
      { method: "POST", body: JSON.stringify(payload) },
      request,
    );
  },

  update: async (
    id: number,
    payload: Omit<ClientUpdatePayload, "id">,
    request: Request,
  ) => {
    if (USE_MOCK_DATA) {
      const existingIndex = MOCK_CLIENTS.findIndex(
        (client) => client.id === id,
      );

      if (existingIndex === -1) {
        throw new Error("Client not found");
      }

      const current = MOCK_CLIENTS[existingIndex];
      const { address } = payload;

      const updated: ClientDetailDB = {
        ...current,
        surname: payload.surname,
        firstName: payload.firstName,
        secondName: payload.secondName,
        phoneNumber: payload.phoneNumber,
        birthDate: payload.birthDate,
        address: address,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        id,
      };

      MOCK_CLIENTS[existingIndex] = updated;
      return updated;
    }

    return api<ClientDetailDB>(
      ENDPOINT + `/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      request,
    );
  },
};
