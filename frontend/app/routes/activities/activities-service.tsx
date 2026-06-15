import { z } from "zod";
import {
  ActivitiesFilterSchema,
  type ActivitiesFilterParamsOutput,
  type ActivitType,
  type Activity,
  type ServerCreateActivityInput,
  type ServerEditActivityInput,
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
    params: ActivitiesFilterParamsOutput,
    request: Request,
  ): Promise<Activity[]> => {
    const parsedParams = ActivitiesFilterSchema.parse(params);
    const result = await activitiesApi.getAllActivites(parsedParams, request);
    return result.data;
  },
  getAllTypes: async (request: Request): Promise<ActivitType[]> => {
    return await activitiesApi.getAllTypes(request);
  },

  create: async (data: ServerCreateActivityInput, request: Request) => {
    return await activitiesApi.create(data, request);
  },
  update: async (
    id: number,
    data: ServerEditActivityInput,
    request: Request,
  ) => {
    return await activitiesApi.update(id, data, request);
  },
};
