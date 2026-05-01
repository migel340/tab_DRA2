import z from "zod";
import { passwordSchema } from "~/lib/schema";
import { AccountStatusSchema, type AccountStatus } from "~/types/status";

export const PersonelRoleSchema = z.enum(["WORKER", "MANAGER"]);
export type PersonelRole = z.infer<typeof PersonelRoleSchema>;

export const PersonelSchema = z.object({
  id: z.number(),
  firstName: z.string().trim().min(1, "Imię jest wymagane"),
  surname: z.string().trim().min(1, "Nazwisko jest wymagane"),
  username: z.string().trim().min(1, "Nazwa użytkownika jest wymagana"),
  role: PersonelRoleSchema,
  active: z.boolean(),
});

export type Personel = z.infer<typeof PersonelSchema>;

const basePersonelFields = PersonelSchema.omit({
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
  password: passwordSchema.optional(),
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

export const PersonelViewSchema = PersonelSchema.transform((data) => {
  const { active, ...rest } = data;
  return {
    ...rest,
    status: (active ? "ACTIVE" : "INACTIVE") as AccountStatus,
  };
});

export type PersonelView = z.output<typeof PersonelViewSchema>;

export const PersonelListSchema = z.array(PersonelViewSchema);

export const PersonelDetailSchema = PersonelViewSchema;
