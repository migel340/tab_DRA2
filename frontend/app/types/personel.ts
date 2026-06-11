import z from "zod";
import { passwordSchema } from "~/lib/schema";
import { AccountStatusSchema, type AccountStatus } from "~/types/status";

export const PersonelRoleSchema = z.enum(["STAFF", "MANAGER"]);
export type PersonelRole = z.infer<typeof PersonelRoleSchema>;

export const PersonelDbSchema = z.object({
  id: z.number(),
  firstName: z.string().trim().min(1, "Imię jest wymagane"),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane"),
  username: z.string().trim().min(1, "Nazwa użytkownika jest wymagana"),
  role: PersonelRoleSchema,
  active: z.boolean(),
});

export const PersonelLookupSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export type PersonelLookup = z.infer<typeof PersonelLookupSchema>;

export type PersonelDB = z.infer<typeof PersonelDbSchema>;

export const RequestManagerSchema = z.object({
  id: z.number(),
  firstName: z.string().trim(),
  surname: z.string().trim(),
  active: z.boolean(),
});

const basePersonelFields = PersonelDbSchema.omit({
  id: true,
  active: true,
});

export const PersonelCreateFormSchema = basePersonelFields.extend({
  status: AccountStatusSchema,
  password: passwordSchema,
});

export const PersonelUpdateFormSchema = basePersonelFields.extend({
  id: z.coerce.number(),
  status: AccountStatusSchema,
  password: passwordSchema.or(z.literal("")).optional(),
});

export const PersonelCreateApiSchema = PersonelCreateFormSchema.transform(
  (data) => {
    const { status, ...rest } = data;
    return {
      ...rest,
      active: status === "ACTIVE",
    };
  },
);

export const PersonelUpdateApiSchema = PersonelUpdateFormSchema.transform(
  (data) => {
    const { status, ...rest } = data;
    return {
      ...rest,
      active: status === "ACTIVE",
    };
  },
);

export type PersonelCreateFormData = z.input<typeof PersonelCreateApiSchema>;
export type PersonelUpdateFormData = z.input<typeof PersonelUpdateApiSchema>;

export type PersonelFormInput = PersonelCreateFormData | PersonelUpdateFormData;

export type PersonelCreatePayload = z.output<typeof PersonelCreateApiSchema>;
export type PersonelUpdatePayload = z.output<typeof PersonelUpdateApiSchema>;

export const PersonelSchema = PersonelDbSchema.transform((data) => {
  const { active, ...rest } = data;
  return {
    ...rest,
    status: (active ? "ACTIVE" : "INACTIVE") as AccountStatus,
  };
});

export type Personel = z.output<typeof PersonelSchema>;

export const PersonelListSchema = z.array(PersonelSchema);

export const PersonelDetailSchema = PersonelSchema;
