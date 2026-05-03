import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "PERSONEL", "MANAGER"]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  surname: z.string(),
  role: UserRoleSchema,
});
export type User = z.infer<typeof UserSchema>;
