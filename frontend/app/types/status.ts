export const RepairStatus = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
] as const;

export type RepairStatus = (typeof RepairStatus)[number];
