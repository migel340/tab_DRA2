import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("/login", "routes/auth/login.tsx"),
  route("/register", "routes/auth/register.tsx"),

  layout("layouts/DashboardLayout.tsx", { id: "_root" }, [
    index("routes/dashboard/DashboardGuard.tsx"),
    layout("layouts/RequestsLayout.tsx", [
      route("/requests", "routes/requests/requests.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
