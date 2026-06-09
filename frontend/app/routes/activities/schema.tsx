import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { PersonelSchema } from "~/types/personel";
import { BaseTableParamsSchema } from "~/types/table";

export const ActivityTypeSchema = z.object({
  id: z.number(),
  actType: z.string(),
});

export const ActivitySchema = z.object({
  type: ActivityTypeSchema,
  dateFinishedCancelled: z.date(),
  dateRegistration: z.date(),
  description: z.string(),
  id: z.number(),
  executor: PersonelSchema,
  requestId: z.number(),
  result: z.string().nullable(),
  seqNo: z.string(),
  status: z.string(),
});

export type Activity = z.infer<typeof ActivitySchema>;

export const ActivityPaginatedSchema =
  createPaginatedResponseSchema(ActivitySchema);

export type ActivityPaginated = z.infer<typeof ActivityPaginatedSchema>;

export const EditActivityFormSchema = z.object({
  type: z.string().readonly(),
  executor: z.string().readonly(),
  status: z.string().min(1, "Wybierz status"),
  description: z.string().readonly(),
  result: z.string().optional(),
});

export type EditActivityFormData = z.infer<typeof EditActivityFormSchema>;

export const EditPersonelActivityFormSchema = z.object({
  status: z.string().min(1, "Wybierz status"),
  result: z.string().optional(),
});

export type EditPersonelActivityFormData = z.infer<
  typeof EditPersonelActivityFormSchema
>;

export const ActivitiesFilterSchema = BaseTableParamsSchema.extend({
  q: z.string().optional(),
  executor: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.string().optional(),
});

export type ActivitiesFilterParams = z.infer<typeof ActivitiesFilterSchema>;
