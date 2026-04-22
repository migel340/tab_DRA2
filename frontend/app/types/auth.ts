export type Role = "ADMIN" | "STAFF" | "MANAGER";

export interface User {
  id: string;
  email: string;
  role: Role;
}
