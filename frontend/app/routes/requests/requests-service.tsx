import { z } from "zod";
import { type RequestsFilterParams, type RequestResponse, RequestResponseSchema } from "./schema";
import { requestsApi } from "./requests-api";
import { RequestSchema, type RequestCreatePayload, type RequestUpdatePayload } from "~/types/requests";

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

const MOCK_REQUESTS: RequestItem[] = [
  {
    id: "2024-01",
    date: "23/04/18",
    manager: "Jan Kowalski",
    description: "Naprawa matrycy komputera. fsfasdfsafsdfafsdfsa....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "Aktywne",
  },
  {
    id: "2024-02",
    date: "23/04/18",
    manager: "Jan Kowalski",
    description: "Czyszczenie układu chłodzenia....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "Aktywne",
  },
  {
    id: "2024-03",
    date: "23/04/18",
    manager: "Jan Kowalski",
    description: "Wymiana baterii w laptopie....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "Aktywne",
  },
];

export const requestsService = {
  getRequestById: async (
    request: Request,
    id: number,
  ): Promise<Request | undefined> => {
    const raw = await requestsApi.getOne(request, id);
    if (!raw) return undefined;
  
    return RequestSchema.parse(raw);
  },
  
  fetchRequestsList: async (
    request: Request,
    params: RequestsFilterParams,
  ): Promise<RequestResponse> => {
    const result = await requestsApi.getAll(params, request);
    return RequestResponseSchema.parse(result);
  },
  
  createRequest: async (
    data: RequestCreatePayload,
    request: Request,
  ): Promise<Request> => {
    const createdRaw = await requestsApi.create(data, request);
    return RequestSchema.parse(createdRaw);
  },
  
  updateRequest: async (
    id: number,
    data: RequestUpdatePayload,
    request: Request,
  ): Promise<Request> => {
    const { id: _id, ...dbPayload } = data;
  
    const updatedRaw = await requestsApi.update(id, dbPayload, request);
    return RequestSchema.parse(updatedRaw);
  },
};