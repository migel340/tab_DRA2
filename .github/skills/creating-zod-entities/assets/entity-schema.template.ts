import { z } from "zod";
// import shared primitives/enums from the project
// e.g. import { passwordSchema } from "~/lib/schema";
// e.g. import { AccountStatusSchema, type AccountStatus } from "~/types/status"
// NOTE: This is a template. Replace placeholder enums/schemas below with project imports.

// Replace `Entity` with the concrete name (PascalCase)
export const EntityRoleSchema = z.enum(["X", "Y"]);

export const EntityDbSchema = z.object({
  id: z.number(),
  // replace with fields from backend
  name: z.string().trim().min(1, "Name is required"),
  role: EntityRoleSchema,
  active: z.boolean(),
});

export type EntityDb = z.infer<typeof EntityDbSchema>;

const baseEntityFields = EntityDbSchema.omit({ id: true, active: true });

// Placeholder status enum — REPLACE with your project's status schema (import instead)
export const AccountStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const EntityCreateFormSchema = baseEntityFields.extend({
  // include status in form schemas when transforms use it
  // REPLACE: use `status: AccountStatusSchema` from your project, e.g. import from `~/types/status`
  status: AccountStatusSchema,
  // example: password: passwordSchema,
});

export const EntityUpdateFormSchema = baseEntityFields.extend({
  id: z.coerce.number(),
  // include status for update forms too when transform needs it
  status: AccountStatusSchema,
  // other update-only fields
});

export const EntityCreateApiSchema = EntityCreateFormSchema.transform(
  (data: z.infer<typeof EntityCreateFormSchema>) => {
    const { status, ...rest } = data;
    return {
      ...rest,
      active: status === "ACTIVE",
    };
  },
);

export const EntityUpdateApiSchema = EntityUpdateFormSchema.transform(
  (data: z.infer<typeof EntityUpdateFormSchema>) => {
    const { status, ...rest } = data;
    return {
      ...rest,
      active: status === "ACTIVE",
    };
  },
);

export type EntityCreateFormData = z.input<typeof EntityCreateApiSchema>;
export type EntityUpdateFormData = z.input<typeof EntityUpdateApiSchema>;

export type EntityFormInput = EntityCreateFormData | EntityUpdateFormData;

export type EntityCreatePayload = z.output<typeof EntityCreateApiSchema>;
export type EntityUpdatePayload = z.output<typeof EntityUpdateApiSchema>;

export const EntitySchema = EntityDbSchema.transform(
  (data: z.infer<typeof EntityDbSchema>) => {
    const { active, ...rest } = data;
    return {
      ...rest,
      // return a status string; prefer reusing project's status enum where possible
      status: active ? "ACTIVE" : "INACTIVE",
    };
  },
);

export type Entity = z.output<typeof EntitySchema>;

export const EntityListSchema = z.array(EntitySchema);
export const EntityDetailSchema = EntitySchema;
