import PageLayout from "~/layouts/PageLayout";
import { columns } from "./columns";
import { DataTable } from "~/components/DataTable";
import type { Route } from "./+types/activities";
import { activitiesService } from "./activities-service";
import { ActivitiesFilterSchema } from "./schema";
import { useNavigate } from "react-router";
import { ActivitiesFiltersForm } from "./activities-filters-form";
import { useTable } from "~/hooks/useTable";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const params = ActivitiesFilterSchema.parse(Object.fromEntries(url.searchParams));
  const activitiesList = await activitiesService.fetchActivitiesList(params);
  return { activitiesList, params };
}

export default function Activities({ loaderData }: Route.ComponentProps) {
  const { activitiesList, params } = loaderData;
  const navigate = useNavigate();

  const { table } = useTable({ data: activitiesList, columns, params });

  return (
    <PageLayout title="Aktywności">
      <DataTable table={table} onRowClick={(id) => navigate(`/activities/${id}`)}>
        <ActivitiesFiltersForm initialValues={params} />
      </DataTable>
    </PageLayout>
  );
}
