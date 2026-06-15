import * as z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";
import { RequestSchema } from "~/types/requests";

export const RequestsFilterSchema = BaseTableParamsSchema.extend({
  q: z.string().optional(),
  manager: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
}).transform((values) => {
  const cleanEntries = Object.entries(values)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (key === "q" && value === "undefined") {
        return [key, ""];
      }
      return [key, String(value)];
    });

  return Object.fromEntries(cleanEntries);
});

export type RequestsFilterParamsInput = z.input<typeof RequestsFilterSchema>;
export type RequestsFilterParamsOutput = z.output<typeof RequestsFilterSchema>;

export const NewRequestFormSchema = z.object({
  clientId: z.string().min(1, "Wybór klienta jest wymagany."),
  deviceId: z.string().min(1, "Wybór urządzenia jest wymagany."),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków."),
});

export type NewRequestFormData = z.infer<typeof NewRequestFormSchema>;

export const RequestResponseSchema =
  createPaginatedResponseSchema(RequestSchema);

export type RequestResponse = z.infer<typeof RequestResponseSchema>;

export const EditRequestFormSchema = z.object({
  clientId: z.string().min(1, "Wybór klienta jest wymagany."),
  deviceId: z.string().min(1, "Wybór urządzenia jest wymagany."),
  status: z.string().min(1, "Wybór statusu jest wymagany."),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków."),
  result: z.string().optional(),
});

export type EditRequestFormData = z.infer<typeof EditRequestFormSchema>;

export const NewActivityFormSchema = z.object({
  type: z.string().min(1, "Wybierz typ aktywności"),
  executor: z.string().optional(),
  seqNo: z.string(),
  description: z.string().min(1, "Opis jest wymagany"),
});

export type NewActivityFormData = z.infer<typeof NewActivityFormSchema>;

export const EditActivityFormSchema = z.object({
  type: z.string().min(1, "Wybierz typ aktywności"),
  executor: z.string().min(1, "Wybierz wykonawcę"),
  status: z.string().min(1, "Wybierz status"),
  description: z.string().min(1, "Opis jest wymagany"),
  result: z.string().optional(),
});

export type EditActivityFormData = z.infer<typeof EditActivityFormSchema>;
