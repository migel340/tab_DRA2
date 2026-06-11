import { z } from "zod";
import { MOCK_ACTIVITIES } from "~/mocks/requests";
import {
  ActivitiesFilterSchema,
  type ActivitiesFilterParams,
  type ActivitType,
  type Activity,
  type ServerCreateActivityInput,
} from "./schema";
import { activitiesApi } from "./activities-api";

export const ActivityItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  desc: z.string(),
  executor: z.string(),
  status: z.string(),
  created: z.string(),
  finished: z.string(),
});

export type ActivityItem = z.infer<typeof ActivityItemSchema>;

export const activitiesService = {
  getById: async (id: number, request: Request): Promise<Activity> => {
    const response = await activitiesApi.getById(id, request);
    return response;
  },
  fetchActivitesForRequest: async (
    requestId: number,
    request: Request,
  ): Promise<Activity[]> => {
    const response = await activitiesApi.getAllForRequest(requestId, request);
    return response.data;
  },
  fetchActivitiesList: async (
    params: ActivitiesFilterParams,
  ): Promise<ActivityItem[]> => {
    const parsedParams = ActivitiesFilterSchema.parse(params);
    let items = z.array(ActivityItemSchema).parse(MOCK_ACTIVITIES);

    if (parsedParams.executor) {
      items = items.filter((a) => a.executor === parsedParams.executor);
    }

    if (parsedParams.status) {
      items = items.filter((a) => a.status === parsedParams.status);
    }

    if (parsedParams.q) {
      const query = parsedParams.q.toLowerCase();
      items = items.filter(
        (a) =>
          a.type.toLowerCase().includes(query) ||
          a.desc.toLowerCase().includes(query) ||
          a.executor.toLowerCase().includes(query),
      );
    }

    return items;
  },

  getAllTypes: async (request: Request): Promise<ActivitType[]> => {
    return await activitiesApi.getAllTypes(request);
  },

  create: async (data: ServerCreateActivityInput, request: Request) => {
    return await activitiesApi.create(data, request);
  },
};
