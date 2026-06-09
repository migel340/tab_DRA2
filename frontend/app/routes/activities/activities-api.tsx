import { api } from "~/lib/api.server";
import type { ActivityPaginated } from "./schema";

const ENDPOINT = "/activities";

export const activitiesApi = {
  getAllForRequest(requestId: number, request: Request) {
    return api<ActivityPaginated>(
      `${ENDPOINT}?requestId=${requestId}`,
      {
        method: "GET",
      },
      request,
    );
  },
};
