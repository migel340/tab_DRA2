import z from "zod";

export const RepairStatusSchema = z.enum([
  "IN_PROGRESS",
  "REGISTERED",
  "DONE",
  "CANCELLED",
]);

export type RepairStatus = z.infer<typeof RepairStatusSchema>;

export const AccountStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export type AccountStatus = z.infer<typeof AccountStatusSchema>;
