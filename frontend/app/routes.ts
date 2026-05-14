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
      route("/requests/create", "routes/requests/requests-create.tsx"),
      route("/requests/:id", "routes/requests/requests-edit.tsx"),
      layout("routes/requests/layout.tsx", [
        route(
          "/requests/:id/activities/new",
          "routes/requests/activities-create.tsx",
        ),
        route(
          "/requests/:id/activities/:activityId",
          "routes/requests/activities-edit.tsx",
        ),
      ]),
    ]),

    layout("routes/personel/layout.tsx", [
      route("/personel", "routes/personel/personel.tsx"),
      route("/personel/create", "routes/personel/personel-create.tsx"),
      route("/personel/:id", "routes/personel/personel-edit.tsx"),
    ]),

    layout("layouts/ActivitiesLayout.tsx", [
      route("/activities", "routes/activities/activities.tsx"),
      route("/activities/:id", "routes/activities/activities-edit.tsx"),
      route(
        "/activities/request-details/:id",
        "routes/activities/activities-request-details.tsx",
      ),
      route(
        "/activities/request/:id/activity/:activityId",
        "routes/activities/activities-request-activity.tsx",
      ),
    ]),
    layout("routes/client/layout.tsx", [
      route("/client", "routes/client/client.tsx"),
      route("/client/create", "routes/client/client-create.tsx"),
      route("/client/:id", "routes/client/client-edit.tsx"),

      layout("routes/device/layout.tsx", [
        route(
          "/client/:clientId/devices/create",
          "routes/device/device-create.tsx",
        ),
        route(
          "/client/:clientId/devices/:deviceId",
          "routes/device/device-edit.tsx",
        ),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
