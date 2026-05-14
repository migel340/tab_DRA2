import { Outlet } from "react-router";

export const handle = {
  breadcrumb: () => "aktywność",
};

export default function ActivityLayout() {
  return <Outlet />;
}