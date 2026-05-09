import z from "zod";

export const RepairStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
]);

export type RepairStatus = z.infer<typeof RepairStatusSchema>;

export const AccountStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export type AccountStatus = z.infer<typeof AccountStatusSchema>;
