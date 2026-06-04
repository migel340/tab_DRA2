import { api } from "~/lib/api.server";
import type {
  CreateDeviceFormData,
  Device,
  DeviceTypeResponse,
  UpdateDeviceFormData,
} from "~/types/device";
import type { DeviceDbResponse, DeviceFilterParams } from "./schema";

const ENDPOINT = "/devices";

export const deviceApi = {
  getOne: async (request: Request, id: number) => {
    return api<Device>(ENDPOINT + `/${id}`, { method: "GET" }, request);
  },

  getAll: async (
    clientId: number,
    params: DeviceFilterParams,
    request: Request,
  ) => {
    return api<DeviceDbResponse>(
      ENDPOINT,
      { method: "GET", params: { ...params, clientId } as Record<string, any> },
      request,
    );
  },

  create: async (
    clientId: number,
    payload: CreateDeviceFormData,
    request: Request,
  ) => {
    return api<Device>(
      ENDPOINT,
      { method: "POST", body: JSON.stringify({ ...payload, clientId }) },
      request,
    );
  },

  update: async (
    id: number,
    payload: Omit<UpdateDeviceFormData, "id">,
    request: Request,
  ) => {
    return api<Device>(
      ENDPOINT + `/${id}`,
      { method: "PUT", body: JSON.stringify(payload) },
      request,
    );
  },

  getTypes: async (request: Request) => {
    return api<DeviceTypeResponse>("/device-types", { method: "GET" }, request);
  },
};
