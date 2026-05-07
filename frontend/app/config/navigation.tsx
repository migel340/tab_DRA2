import type { NavItem } from "~/types/navigation";
import { User } from "lucide-react";

export const ALL_APP_LINKS: NavItem[] = [
  {
    to: "/requests",
    label: "Zgłoszenia",
    roles: ["MANAGER"],
  },

  {
    to: "/personel",
    label: "Użytkownicy",
    roles: ["ADMIN"],
    icon: <User />,
  },

  {
    to: "/client",
    label: "Klienci",
    roles: ["MANAGER"],
  },
];
