import type { Role } from "./auth";

export interface Personel {
  id: number;
  firstName: string;
  surname: string;
  role: Role;
  username: string;
  active: boolean;
}
