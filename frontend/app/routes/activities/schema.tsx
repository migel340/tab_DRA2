import * as z from "zod";
import { BaseTableParamsSchema } from "~/types/table";

export const EditActivityFormSchema = z.object({
  sequenceNumber: z.string().optional(),
  type: z.string().readonly(),
  executor: z.string().readonly(),
  status: z.string().min(1, "Wybierz status"),
  description: z.string().readonly(),
  result: z.string().optional(),
});

export type EditActivityFormData = z.infer<typeof EditActivityFormSchema>;


export const EditPersonelActivityFormSchema = z.object({
  sequenceNumber: z.string().optional(),
  status: z.string().min(1, "Wybierz status"),
  result: z.string().optional(),
});

export type EditPersonelActivityFormData = z.infer<typeof EditPersonelActivityFormSchema>;

export const ActivitiesFilterSchema = BaseTableParamsSchema.extend({
  q: z.string().optional(),
  executor: z.string().optional(),
  status: z.string().optional(),
  dateRange: z.string().optional(),
});

export type ActivitiesFilterParams = z.infer<typeof ActivitiesFilterSchema>;