import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  route("/login", "routes/auth/login.tsx"),
  route("/register", "routes/auth/register.tsx"),

  layout("layouts/DashboardLayout.tsx", { id: "_root" }, [
    index("routes/dashboard/DashboardGuard.tsx"),
    layout("layouts/RequestsLayout.tsx", [
      route("/requests", "routes/requests/requests.tsx"),
      route("/requests/create", "routes/requests/requests-create.tsx"),
      route("/requests/:id", "routes/requests/requests-edit.tsx"),
      layout("routes/requests/layout.tsx", [
        route("/requests/:id/activities/new", "routes/requests/activities-create.tsx"),
        route("/requests/:id/activities/:activityId", "routes/requests/activities-edit.tsx"),
      ]),
    ]),

    layout("routes/personel/layout.tsx", [
      route("/personel", "routes/personel/personel.tsx"),
      route("/personel/create", "routes/personel/personel-create.tsx"),
      route("/personel/:id", "routes/personel/personel-edit.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
