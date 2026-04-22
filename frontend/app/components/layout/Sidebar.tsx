import { NavLink, useRouteLoaderData } from "react-router";
import { ALL_APP_LINKS } from "~/config/navigation";
import type { Route } from "../../layouts/+types/DashboardLayout";
import { LogOut, Wrench } from "lucide-react"; // Przykładowe ikonki

export default function Sidebar() {
  const data = useRouteLoaderData(
    "_root",
  ) as Route.ComponentProps["loaderData"];

  const user = data?.user;

  const visibleLinks = ALL_APP_LINKS.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <div className="flex flex-col h-full p-4 bg-background">
      <div className="mb-10 px-4 pt-4">
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          Naprawy
        </h2>
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
            <span className="font-medium text-sm">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-border pt-4 px-2">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Wyloguj</span>
        </NavLink>
      </div>
    </div>
  );
}
