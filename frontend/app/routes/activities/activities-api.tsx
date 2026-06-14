import { api } from "~/lib/api.server";
import type {
  ActivityPaginated,
  Activity,
  ActivitType,
  ServerCreateActivityInput,
  ServerEditActivityInput,
} from "./schema";

const ENDPOINT = "/activities";

export const activitiesApi = {
  getById(id: number, request: Request) {
    return api<Activity>(`${ENDPOINT}/${id}`, { method: "GET" }, request);
  },
  getAllForRequest(requestId: number, request: Request) {
    return api<ActivityPaginated>(
      `${ENDPOINT}?requestId=${requestId}`,
      {
        method: "GET",
      },
      request,
    );
  },

  getAllTypes(request: Request) {
    return api<ActivitType[]>("/activity-types", { method: "GET" }, request);
  },

  create(data: ServerCreateActivityInput, request: Request) {
    return api<Activity>(
      `${ENDPOINT}`,
      { method: "POST", body: JSON.stringify(data) },
      request,
    );
  },
  update(id: number, data: ServerEditActivityInput, request: Request) {
    return api<Activity>(
      `${ENDPOINT}/${id}`,
      { method: "PUT", body: JSON.stringify(data) },
      request,
    );
  },
};
