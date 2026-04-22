import { Link, useLocation, useRouteLoaderData } from "react-router";
import { ALL_APP_LINKS } from "~/config/navigation";
import type { Route } from "../../layouts/+types/DashboardLayout";

export default function Sidebar() {
  const data = useRouteLoaderData(
    "_root",
  ) as Route.ComponentProps["loaderData"];
  const { user } = data;
  const location = useLocation();

  const visibleLinks = ALL_APP_LINKS.filter((link) =>
    link.roles.includes(user.role),
  );

  return (
    <div className="flex flex-col p-4 gap-5">
      <div>
        <div className="text-xl font-bold mb-5  p-2 text-blue-600">Naprawy</div>
        <nav className="space-y-1">
          {visibleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block p-2 rounded-lg transition-colors ${
                location.pathname === link.to
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t pt-4">
        <Link
          to="/login"
          className="text-red-500 p-2 block hover:bg-red-50 rounded"
        >
          Wyloguj się
        </Link>
      </div>
    </div>
  );
}
