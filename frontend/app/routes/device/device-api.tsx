import { api } from "~/lib/api.server";
import type {
  DeviceDB,
  DeviceCreatePayload,
  DeviceUpdatePayload,
} from "~/types/device";
import type { DeviceDbResponse, DeviceFilterParams } from "./schema";
import { MOCK_DEVICES, filterMockDevices } from "~/mocks/device";

const ENDPOINT = "/devices";

const USE_MOCK_DATA = true;

export const deviceApi = {
  getOne: async (request: Request, id: number) => {
    if (USE_MOCK_DATA) {
      return MOCK_DEVICES.find((d) => d.id === id) ?? null;
    }

    return api<DeviceDB>(ENDPOINT + `/${id}`, { method: "GET" }, request);
  },

  getAll: async (
    clientId: number,
    params: DeviceFilterParams,
    request: Request,
  ) => {
    if (USE_MOCK_DATA) {
      const limit = params.limit ? parseInt(String(params.limit)) : 10;
      const page = params.page ? parseInt(String(params.page)) : 1;
      const offset = (page - 1) * limit;
      const query = params.q ? String(params.q) : undefined;

      const result = filterMockDevices(clientId, query, limit, offset);

      return {
        data: result.data,
        meta: { ...result.meta, sort: params.sort, orderBy: params.orderBy },
      } as DeviceDbResponse;
    }

    return api<DeviceDbResponse>(
      ENDPOINT + `?clientId=${clientId}`,
      { method: "GET", params },
      request,
    );
  },

  create: async (
    clientId: number,
    payload: DeviceCreatePayload,
    request: Request,
  ) => {
    if (USE_MOCK_DATA) {
      const nextId =
        MOCK_DEVICES.length > 0
          ? Math.max(...MOCK_DEVICES.map((d) => d.id)) + 1
          : 1;

      const created: DeviceDB = {
        id: nextId,
        name: payload.name,
        type: payload.type,
        client_id: clientId,
      };

      MOCK_DEVICES.push(created);
      return created;
    }

    return api<DeviceDB>(
      ENDPOINT,
      { method: "POST", body: JSON.stringify({ ...payload, clientId }) },
      request,
    );
  },

  update: async (
    id: number,
    payload: Omit<DeviceUpdatePayload, "id">,
    request: Request,
  ) => {
    if (USE_MOCK_DATA) {
      const idx = MOCK_DEVICES.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error("Device not found");

      const updated: DeviceDB = {
        ...MOCK_DEVICES[idx],
        name: payload.name,
        type: payload.type,
      };

      MOCK_DEVICES[idx] = updated;
      return updated;
    }

    return api<DeviceDB>(
      ENDPOINT + `/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      request,
    );
  },

  delete: async (id: number, request: Request) => {
    if (USE_MOCK_DATA) {
      const idx = MOCK_DEVICES.findIndex((d) => d.id === id);
      if (idx === -1) throw new Error("Device not found");
      MOCK_DEVICES.splice(idx, 1);
      return;
    }

    return api<void>(ENDPOINT + `/${id}`, { method: "DELETE" }, request);
  },
};
