import { z } from "zod";
import { passwordSchema } from "~/lib/schema";

export const UserRoleSchema = z.enum(["ADMIN", "MANAGER", "STAFF"]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const LoginSchema = z.object({
  username: z.string().trim().min(1, "Nazwa użytkownika jest wymagana"),
  password: passwordSchema,
});

export type LoginData = z.input<typeof LoginSchema>;

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  surname: z.string(),
  role: UserRoleSchema,
});

export type User = z.infer<typeof UserSchema>;

export const AuthResponseSchema = z.object({
  token: z.string().min(1),
  id: z.number(),
  username: z.string(),
  firstName: z.string(),
  surname: z.string(),
  role: UserRoleSchema,
});

export type AuthResponse = z.output<typeof AuthResponseSchema>;
