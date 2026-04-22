import type { NavItem } from "~/types/navigation";

export const ALL_APP_LINKS: NavItem[] = [
  {
    to: "/requests",
    label: "Zgłoszenia",
    roles: ["MANAGER"],
  },
];
