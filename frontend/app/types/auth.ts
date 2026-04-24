export type Role = "ADMIN" | "STAFF" | "MANAGER";

export interface User {
  id: number;
  username: string;
  firstName: string;
  surname: string;
  role: Role;
}
