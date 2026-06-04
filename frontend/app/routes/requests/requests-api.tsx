import { api } from "~/lib/api.server";
import type { RequestDB } from "~/types/requests";
import type { NewRequestFormData, RequestsFilterParams, EditRequestFormData, RequestResponse} from "./schema";

const ENDPOINT = "/requests";

export const requestsApi = {
  getOne: async (request: Request, id: number) => {
    return api<RequestDB>(
      ENDPOINT + `/${id}`,
      {
        method: "GET",
      },
      request,
    );
  },

  getAll: async (params: RequestsFilterParams, request: Request) =>
    api<RequestResponse>(
      ENDPOINT,
      {
        method: "GET",
        params: params,
      },
      request,
    ),

  create: async (payload: NewRequestFormData, request: Request) =>
    api<RequestDB>(
      ENDPOINT,
      { method: "POST", body: JSON.stringify(payload) },
      request,
    ),

  update: async (id: number, payload: EditRequestFormData, request: Request) =>
    api<RequestDB>(
      ENDPOINT + `/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      request,
    ),
};