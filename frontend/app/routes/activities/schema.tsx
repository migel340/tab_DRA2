import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { PersonelLookupSchema } from "~/types/personel";
import { BaseTableParamsSchema } from "~/types/table";

export const ActivityTypeSchema = z.object({
  id: z.number(),
  actType: z.string(),
});

export type ActivitType = z.infer<typeof ActivityTypeSchema>;

export const ActivitySchema = z.object({
  type: ActivityTypeSchema,
  dateFinishedCancelled: z.date(),
  dateRegistration: z.date(),
  description: z.string().min(1, "Opis jest wymagany"),
  id: z.number(),
  executor: PersonelLookupSchema.optional(),
  requestId: z.number(),
  result: z.string().nullable(),
  seqNo: z
    .preprocess(
      (val) => (val === "" || val === undefined ? undefined : Number(val)),
      z
        .number("Numer sekwencyjny jest wymagany")
        .min(1, "Numer musi być większy od 0"),
    )
    .transform((val) => String(val)),
  status: z.string(),
});

export const CreateActivitySchema = ActivitySchema.pick({
  type: true,
  seqNo: true,
  description: true,
  executor: true,
});

export type CreateActivityFormInputValues = z.input<
  typeof CreateActivitySchema
>;
export type CreateActivityFormValues = z.output<typeof CreateActivitySchema>;

export const ServerCreateActivitySchema = CreateActivitySchema.extend({
  requestId: z.coerce.number(),
  status: z.string(),
}).transform((data) => {
  const { type, executor, ...rest } = data;

  const personelId = executor && executor.id > 0 ? executor.id : null;

  return {
    ...rest,
    actTypeId: type.id,
    personelId: personelId,
  };
});

export type ServerCreateActivityInput = z.infer<
  typeof ServerCreateActivitySchema
>;

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
