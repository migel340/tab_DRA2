import PageLayout from "~/layouts/PageLayout";
import { columns } from "./columns";
import { DataTable } from "~/components/DataTable";
import type { Route } from "./+types/activities";
import { activitiesService } from "./activities-service";
import { ActivitiesFilterSchema } from "./schema";
import { redirect, useNavigate } from "react-router";
import { ActivitiesFiltersForm } from "./activities-filters-form";
import { useTable } from "~/hooks/useTable";
import { personelService } from "../personel/personel-service";
import { requireUser } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const loggedUser = await requireUser(request);

  if (!url.searchParams.has("status") && !url.searchParams.has("executor")) {
    url.searchParams.set("status", "REGISTERED");
    url.searchParams.set("executor", loggedUser.id.toString());

    return redirect(`/activities?${url.searchParams.toString()}`);
  }

  const params = ActivitiesFilterSchema.parse(
    Object.fromEntries(url.searchParams),
  );

  const activitiesList = await activitiesService.fetchActivitiesList(
    params,
    request,
  );

  const executors = await personelService.fetchLookup(request, "STAFF");

  return { activitiesList, params, executors };
}

export default function Activities({ loaderData }: Route.ComponentProps) {
  const { activitiesList, params, executors } = loaderData;
  const navigate = useNavigate();

  const { table } = useTable({ data: activitiesList, columns, params });

  return (
    <PageLayout title="Aktywności">
      <DataTable
        table={table}
        onRowClick={(id) => navigate(`/activities/${id}`)}
      >
        <ActivitiesFiltersForm initialValues={params} excutors={executors} />
      </DataTable>
    </PageLayout>
  );
}
