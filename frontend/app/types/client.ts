import z from "zod";

// DB schemas for different API responses

export const ClientAddressObjectSchema = z.object({
  city: z.string().trim().min(1, "Miasto jest wymagane").max(20),
  state: z.string().trim().min(1, "Województwo jest wymagane").max(20),
  postalCode: z.string().trim().min(1, "Kod pocztowy jest wymagany").max(6),
  country: z.string().trim().min(1, "Kraj jest wymagany").max(20),
});

// List response: flat fields, no address object
export const ClientListItemDbSchema = z.object({
  id: z.number(),
  firstName: z.string().trim().min(1, "Imię jest wymagane").max(50),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane").max(50),
  phoneNumber: z.string().trim().min(1, "Numer telefonu jest wymagany"),
  device_count: z.number(),
  birthDate: z.string().or(z.date()),
});

export type ClientListItemDB = z.infer<typeof ClientListItemDbSchema>;

// Detail response: nested address object + additional fields
export const ClientDetailDbSchema = z.object({
  id: z.number(),
  firstName: z.string().trim().min(1, "Imię jest wymagane").max(50),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane").max(50),
  secondName: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(1, "Numer telefonu jest wymagany"),
  birthDate: z.string().or(z.date()),
  address: ClientAddressObjectSchema,
  addressId: z.number().optional(),
  city: z.string().trim().optional(),
  country: z.string().trim().optional(),
  state: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  deviceId: z.number().optional(),
  device_count: z.number(),
});

export type ClientDetailDB = z.infer<typeof ClientDetailDbSchema>;

// Canonical domain schema (used for both list and detail)
export const ClientSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  surname: z.string(),
  secondName: z.string().optional(),
  phoneNumber: z.string(),
  birthDate: z.date().optional(),
  address: z
    .object({
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    })
    .optional(),
  deviceCount: z.number(),
});

export type Client = z.infer<typeof ClientSchema>;

// Transform functions for different API responses
const transformListItemToClient = (data: ClientListItemDB): Client => ({
  id: data.id,
  firstName: data.firstName,
  surname: data.surname,
  phoneNumber: data.phoneNumber,
  deviceCount: data.device_count,
  birthDate:
    typeof data.birthDate === "string"
      ? new Date(data.birthDate)
      : data.birthDate,
});

const transformDetailToClient = (data: ClientDetailDB): Client => ({
  id: data.id,
  firstName: data.firstName,
  surname: data.surname,
  secondName: data.secondName,
  phoneNumber: data.phoneNumber,
  birthDate:
    typeof data.birthDate === "string"
      ? new Date(data.birthDate)
      : data.birthDate,
  address: {
    city: data.address.city,
    state: data.address.state,
    postalCode: data.address.postalCode,
    country: data.address.country,
  },
  deviceCount: data.device_count,
});

// Parsers for API responses
export const ClientListItemParser = ClientListItemDbSchema.transform(
  transformListItemToClient,
);
export const ClientDetailParser = ClientDetailDbSchema.transform(
  transformDetailToClient,
);

export const ClientListSchema = z.array(ClientListItemParser);
export const ClientDetailSchema = ClientDetailParser;

// Form schemas for create/update
export const ClientAddressFormSchema = z.object({
  city: z.string().trim().min(1, "Miasto jest wymagane").max(20).regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Miasto może zawierać tylko litery"),
  state: z.string().trim().min(1, "Województwo jest wymagane").max(20).regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-]+$/, "Województwo może zawierać tylko litery"),
  postalCode: z.string().trim().min(1, "Kod pocztowy jest wymagany").max(6).regex(/^\d{2}-\d{3}$/, "Nieprawidłowy kod pocztowy"),
  country: z.string().trim().min(1, "Kraj jest wymagany").max(20).regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Kraj może zawierać tylko litery"),
});

const baseClientFormFields = z.object({
  firstName: z.string().trim().min(1, "Imię jest wymagane").max(50).regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/, "Imię może zawierać tylko litery"),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane").max(50).regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/, "Nazwisko może zawierać tylko litery"),
  secondName: z.string().trim().optional(),
  phoneNumber: z.string().trim().min(1, "Numer telefonu jest wymagany").regex(/^\d{1,9}$/, "Za długi numer telefonu"),
  birthDate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(
      (value) => !Number.isNaN(new Date(value).getTime()),
      "Nieprawidłowa data urodzenia",
    ),
  address: ClientAddressFormSchema,
});

export const ClientCreateFormSchema = baseClientFormFields;

export const ClientUpdateFormSchema = baseClientFormFields.extend({
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
  ({ address, birthDate, id, ...rest }) => ({
    id,
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

export type ClientCreateFormData = z.input<typeof ClientCreateApiSchema>;
export type ClientUpdateFormData = z.input<typeof ClientUpdateApiSchema>;

export type ClientCreatePayload = z.output<typeof ClientCreateApiSchema>;
export type ClientUpdatePayload = z.output<typeof ClientUpdateApiSchema>;
