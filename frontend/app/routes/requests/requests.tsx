import PageLayout from "~/layouts/PageLayout";
import { DataTable } from "~/components/DataTable";
import { columns } from "./columns";
import type { Route } from "./+types/requests";
import { requestsService } from "./requests-service";
import { RequestsFilterSchema } from "./schema";
import { useNavigate } from "react-router";
import { RequestsFiltersForm } from "./requests-filters-form";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useTable } from "~/hooks/useTable";

export const handle = {
  breadcrumb: () => "lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const params = RequestsFilterSchema.parse(Object.fromEntries(url.searchParams));
  const requestsList = await requestsService.fetchRequestsList(params);
  return { requestsList, params };
}

export default function Requests({ loaderData }: Route.ComponentProps) {
  const { requestsList, params } = loaderData;
  const navigate = useNavigate();

  const { table } = useTable({ data: requestsList, columns, params });

  return (
    <PageLayout
      title="Zgłoszenia"
      actions={
        <Button variant="outline" className="bg-white text-black border-gray-300 hover:bg-gray-50 shadow-sm" onClick={() => navigate("/requests/create")}>
          <Plus className="mr-2 h-4 w-4" /> Dodaj zgłoszenie
        </Button>
      }
    >
      <DataTable table={table} onRowClick={(id) => navigate(`/requests/${id}`)}>
        <RequestsFiltersForm initialValues={params} />
      </DataTable>
    </PageLayout>
  );
}
