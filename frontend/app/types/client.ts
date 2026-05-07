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

export const ClientSchema = ClientDbSchema;

export type Client = z.output<typeof ClientSchema>;

export const ClientListSchema = z.array(ClientSchema);

export const ClientDetailSchema = ClientSchema;
