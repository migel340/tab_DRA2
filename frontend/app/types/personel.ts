import z from "zod";

export const PersonelRoleSchema = z.enum(["WORKER", "MANAGER"]);

export type PersonelRole = z.infer<typeof PersonelRoleSchema>;

export const PersonelSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string().min(1, "Imię jest wymagane"),
  surname: z.string().min(1, "Nazwisko jest wymagane"),
  role: PersonelRoleSchema,
  active: z.boolean(),
});

export type Personel = z.infer<typeof PersonelSchema>;
