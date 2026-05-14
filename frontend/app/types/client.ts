import z from "zod";

export const ClientAddressDbSchema = z.object({
  city: z.string().trim().min(1, "Miasto jest wymagane").max(20),
  state: z.string().trim().min(1, "Województwo jest wymagane").max(20),
  postal_code: z.string().trim().min(1, "Kod pocztowy jest wymagany").max(6),
  country: z.string().trim().min(1, "Kraj jest wymagany").max(20),
});

export const ClientDbSchema = z.object({
  id: z.number(),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane").max(50),
  firstName: z.string().trim().min(1, "Imię jest wymagane").max(50),
  secondName: z.string().trim().optional(),
  tel: z.string().trim().min(1, "Numer telefonu jest wymagany"),
  birthDate: z.coerce.date(),
  ...ClientAddressDbSchema.shape,
  device_count: z.number(),
});

export type ClientDB = z.infer<typeof ClientDbSchema>;

export const ClientAddressSchema = z.object({
  city: z.string().trim().min(1, "Miasto jest wymagane").max(20),
  state: z.string().trim().min(1, "Województwo jest wymagane").max(20),
  postalCode: z.string().trim().min(1, "Kod pocztowy jest wymagany").max(6),
  country: z.string().trim().min(1, "Kraj jest wymagany").max(20),
});

const baseClientFields = z.object({
  surname: z.string().trim().min(1, "Nazwisko jest wymagane").max(50),
  firstName: z.string().trim().min(1, "Imię jest wymagane").max(50),
  secondName: z.string().trim().optional(),
  tel: z.string().trim().min(1, "Numer telefonu jest wymagany"),
  birthDate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Nieprawidłowa data urodzenia",
    ),
  address: ClientAddressSchema,
});

export const ClientCreateFormSchema = baseClientFields;

export const ClientUpdateFormSchema = baseClientFields.extend({
  id: z.coerce.number(),
});

export const ClientCreateApiSchema = ClientCreateFormSchema.transform(
  ({ address, birthDate, ...rest }) => ({
    ...rest,
    birthDate: new Date(birthDate),
    address: {
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
  }),
);

export const ClientUpdateApiSchema = ClientUpdateFormSchema.transform(
  ({ address, birthDate, ...rest }) => ({
    ...rest,
    birthDate: new Date(birthDate),
    address: {
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    },
  }),
);

export type ClientCreateFormData = z.output<typeof ClientCreateFormSchema>;
export type ClientUpdateFormData = z.output<typeof ClientUpdateFormSchema>;

export type ClientCreatePayload = z.output<typeof ClientCreateApiSchema>;
export type ClientUpdatePayload = z.output<typeof ClientUpdateApiSchema>;

export const ClientSchema = ClientDbSchema.transform((data) => ({
  id: data.id,
  surname: data.surname,
  firstName: data.firstName,
  secondName: data.secondName,
  tel: data.tel,
  birthDate: data.birthDate,
  address: {
    city: data.city,
    state: data.state,
    postalCode: data.postal_code,
    country: data.country,
  },
  deviceCount: data.device_count,
}));

export type Client = z.output<typeof ClientSchema>;

export const ClientListSchema = z.array(ClientSchema);

export const ClientDetailSchema = ClientSchema;
