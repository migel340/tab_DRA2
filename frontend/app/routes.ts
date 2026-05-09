import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/login", "routes/auth/login.tsx"),
  route("/logout", "routes/auth/logout.tsx"),

  layout("layouts/DashboardLayout.tsx", { id: "_root" }, [
    index("routes/dashboard/DashboardGuard.tsx"),
    layout("layouts/RequestsLayout.tsx", [
      route("/requests", "routes/requests/requests.tsx"),
    ]),

    layout("routes/personel/layout.tsx", [
      route("/personel", "routes/personel/personel.tsx"),
      route("/personel/create", "routes/personel/personel-create.tsx"),
      route("/personel/:id", "routes/personel/personel-edit.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
