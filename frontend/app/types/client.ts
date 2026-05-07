import z from "zod";

export const ClientDbSchema = z.object({
  id: z.number(),
  idDevice: z.number(),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane"),
  firstName: z.string().trim().min(1, "Imię jest wymagane"),
  secondName: z.string().trim().optional(),
  tel: z.string().trim().min(1, "Numer telefonu jest wymagany"),
  birthDate: z.coerce.date(),
});

export type ClientDB = z.infer<typeof ClientDbSchema>;

const baseClientFields = ClientDbSchema.omit({
  id: true,
  idDevice: true,
  birthDate: true,
}).extend({
  idDevice: z
    .string()
    .min(1, "ID urządzenia jest wymagane")
    .refine((value) => Number(value) > 0, "ID urządzenia jest wymagane"),
  birthDate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Nieprawidłowa data urodzenia",
    ),
});

export const ClientCreateFormSchema = baseClientFields;

export const ClientUpdateFormSchema = baseClientFields.extend({
  id: z.coerce.number(),
});

export const ClientCreateApiSchema = ClientCreateFormSchema.transform(
  (data) => ({
    ...data,
    idDevice: Number(data.idDevice),
    birthDate: new Date(data.birthDate),
  }),
);

export const ClientUpdateApiSchema = ClientUpdateFormSchema.transform(
  (data) => ({
    ...data,
    idDevice: Number(data.idDevice),
    birthDate: new Date(data.birthDate),
  }),
);

export type ClientCreateFormData = z.output<typeof ClientCreateFormSchema>;
export type ClientUpdateFormData = z.output<typeof ClientUpdateFormSchema>;

export type ClientCreatePayload = z.output<typeof ClientCreateApiSchema>;
export type ClientUpdatePayload = z.output<typeof ClientUpdateApiSchema>;

export const ClientSchema = ClientDbSchema;

export type Client = z.output<typeof ClientSchema>;

export const ClientListSchema = z.array(ClientSchema);

export const ClientDetailSchema = ClientSchema;
