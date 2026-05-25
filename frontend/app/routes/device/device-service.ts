import { deviceApi } from "./device-api";
import { DeviceSchema } from "~/types/device";
import type {
  CreateDeviceFormData,
  Device,
  DeviceType,
  UpdateDeviceFormData,
} from "~/types/device";
import { DeviceResponseFromDbSchema, type DeviceFilterParams } from "./schema";

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
    request: Request,
    clientId: number,
    params: DeviceFilterParams,
  ) => {
    const result = await deviceApi.getAll(clientId, params, request);
    return DeviceResponseFromDbSchema.parse(result);
  },

  createDevice: async (
    clientId: number,
    data: CreateDeviceFormData,
    request: Request,
  ): Promise<Device> => {
    const raw = await deviceApi.create(clientId, data, request);
    return DeviceSchema.parse(raw);
  },

  updateDevice: async (
    id: number,
    data: UpdateDeviceFormData,
    request: Request,
  ): Promise<Device> => {
    const { id: _id, ...payload } = data;
    const raw = await deviceApi.update(id, payload, request);
    return DeviceSchema.parse(raw);
  },

  getDevicesTypes: async (requet: Request): Promise<DeviceType[]> => {
    const response = await deviceApi.getTypes(requet);
    return response.data;
  },
};
