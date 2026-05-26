import { z } from "zod";
import { MOCK_ACTIVITIES } from "~/mocks/requests";
import { ActivitiesFilterSchema, type ActivitiesFilterParams } from "./schema";

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
  fetchActivitiesList: async (params: ActivitiesFilterParams): Promise<ActivityItem[]> => {
    const parsedParams = ActivitiesFilterSchema.parse(params);
    let items = z.array(ActivityItemSchema).parse(MOCK_ACTIVITIES);

    if (parsedParams.executor) {
      items = items.filter(
        (a) => a.executor === parsedParams.executor,
      );
    }

    if (parsedParams.status) {
      items = items.filter(
        (a) => a.status === parsedParams.status,
      );
    }

    if (parsedParams.q && parsedParams.q !== "undefined") {
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
};
