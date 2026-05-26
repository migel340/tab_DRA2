import { Form, NavLink } from "react-router";
import { ALL_APP_LINKS } from "~/config/navigation";
import { LogOut } from "lucide-react";
import type { AuthResponse } from "~/types/auth";

interface SidebarProps {
  user: AuthResponse;
}

export default function Sidebar({ user }: SidebarProps) {
  const visibleLinks = ALL_APP_LINKS.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <div className="flex flex-col h-full p-4 bg-background">
      <div className="mb-10 px-4 pt-5">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Naprawy
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {user.firstName} {user.surname}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {getUserRole(user.role)}
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {visibleLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            {link.icon && link.icon}
            <span className="font-medium text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4 px-2">
        <Form method="post" action="/logout">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Wyloguj</span>
          </button>
        </Form>
      </div>
    </div>
  );
}

const getUserRole = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "Administrator";
    case "MANAGER":
      return "Manager";
    case "STAFF":
      return "Pracownik";
    default:
      return "Brak roli";
  }
};
