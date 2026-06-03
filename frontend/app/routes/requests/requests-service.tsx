import { z } from "zod";
import { type RequestsFilterParams, type RequestResponse, RequestResponseSchema } from "./schema";
import { requestsApi } from "./requests-api";
import { deviceService } from "../device/device-service";
import { personelService } from "../personel/personel-service";
import { RequestSchema, type RequestCreatePayload, type RequestUpdatePayload, type RequestDB } from "~/types/requests";

export const RequestItemSchema = z.object({
  id: z.string(),
  date: z.string(),
  manager: z.string(),
  description: z.string(),
  client: z.string(),
  device: z.string(),
  progress: z.number(),
  status: z.string(),
});

export type RequestItem = z.infer<typeof RequestItemSchema>;

export const requestsService = {
  getRequestById: async (
    request: Request,
    id: number,
  ): Promise<RequestDB | undefined> => {
    const raw = await requestsApi.getOne(request, id);
    if (!raw) return undefined;
  
    return RequestSchema.parse(raw);
  },
  
  fetchRequestsList: async (
    request: Request,
    params: RequestsFilterParams,
  ): Promise<RequestResponse> => {
    const rawResult = await requestsApi.getAll(params, request);
    if(rawResult?.data && Array.isArray(rawResult.data)) {
      const enrichedRequests = await Promise.all(
        rawResult.data.map(async (req: any) => {
          const enrichedReq = { ...req };

          if(req.deviceId) {
            try {
              const deviceData = await deviceService.getDeviceById(request, req.deviceId);
              enrichedReq.device = deviceData;
            } catch (error) {
              console.error("Nie udało się pobrać urządzenia ID: ${req.deviceId}", error);
            }
          }

          return enrichedReq;
        })
      );
      rawResult.data = enrichedRequests;
    }
    return RequestResponseSchema.parse(rawResult);
  },
  
  createRequest: async (
    data: RequestCreatePayload,
    request: Request,
  ): Promise<RequestDB> => {
    const createdRaw = await requestsApi.create(data, request);
    return RequestSchema.parse(createdRaw);
  },
  
  updateRequest: async (
    id: number,
    data: RequestUpdatePayload,
    request: Request,
  ): Promise<RequestDB> => {
    const { id: _id, ...dbPayload } = data;
  
    const updatedRaw = await requestsApi.update(id, dbPayload, request);
    return RequestSchema.parse(updatedRaw);
  },
};