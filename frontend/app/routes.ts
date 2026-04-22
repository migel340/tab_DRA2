import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/DashboardLayout.tsx", { id: "_root" }, [
    index("routes/dashboard/DashboardGuard.tsx"),
    route("/requests", "routes/requests/requests.tsx"),
  ]),
] satisfies RouteConfig;
