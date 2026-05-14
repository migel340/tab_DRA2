import { deviceApi } from "./device-api";
import { DeviceSchema } from "~/types/device";
import type {
  Device,
  DeviceCreatePayload,
  DeviceUpdatePayload,
} from "~/types/device";
import {
  DeviceResponseFromDbSchema,
  type DeviceFilterParams,
  type DeviceResponse,
} from "~/types/device";

export const deviceService = {
  getDeviceById: async (
    request: Request,
    id: number,
  ): Promise<Device | undefined> => {
    const raw = await deviceApi.getOne(request, id);
    if (!raw) return undefined;

    return DeviceSchema.parse(raw);
  },

  fetchDeviceList: async (
    clientId: number,
    request: Request,
    params: DeviceFilterParams,
  ): Promise<DeviceResponse> => {
    const result = await deviceApi.getAll(clientId, params, request);
    return DeviceResponseFromDbSchema.parse(result);
  },

  createDevice: async (
    clientId: number,
    data: DeviceCreatePayload,
    request: Request,
  ): Promise<Device> => {
    const createdRaw = await deviceApi.create(clientId, data, request);
    return DeviceSchema.parse(createdRaw);
  },

  updateDevice: async (
    id: number,
    data: DeviceUpdatePayload,
    request: Request,
  ): Promise<Device> => {
    const { id: _id, ...dbPayload } = data;

    const updatedRaw = await deviceApi.update(id, dbPayload, request);
    return DeviceSchema.parse(updatedRaw);
  },

  deleteDevice: async (id: number, request: Request): Promise<void> => {
    await deviceApi.delete(id, request);
  },
};
