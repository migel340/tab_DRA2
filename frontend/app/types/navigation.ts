import type { Role } from "./auth";

export interface NavItem {
  to: string;
  label: string;
  roles: Role[];
  icon?: React.ReactNode;
}
