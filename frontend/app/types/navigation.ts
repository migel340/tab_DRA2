import type { UserRole } from "./auth";

export interface NavItem {
  to: string;
  label: string;
  roles: UserRole[];
  icon?: React.ReactNode;
}
