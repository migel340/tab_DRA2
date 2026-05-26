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
import { userContext } from "~/context";

export const handle = {
  breadcrumb: () => "lista",
};

export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const user = context.get(userContext) as any;

  const rawParams = Object.fromEntries(url.searchParams);
  
  // Domyślne wartości filtrów
  const mergedParams = {
    manager: rawParams.manager ?? user?.username ?? "all",
    status: rawParams.status ?? "OPN",
    dateRange: rawParams.dateRange ?? "today",
    ...rawParams,
  };

  const params = RequestsFilterSchema.parse(mergedParams);
  const requestsList = await requestsService.fetchRequestsList(params);
  return { requestsList, params, user };
}

export default function Requests({ loaderData }: Route.ComponentProps) {
  const { requestsList, params, user } = loaderData;
  const navigate = useNavigate();

  const { table } = useTable({
    data: requestsList,
    columns,
    params,
    pageCount: 1, // TODO: Docelowo pobranie z API np. loaderData.pageCount
  });
  
  return (
    <PageLayout
      title="Zgłoszenia"
      actions={
        <Button
          variant="outline"
          className="bg-white text-black border-gray-300 hover:bg-gray-50 shadow-sm"
          onClick={() => navigate("/requests/create")}
        >
          <Plus className="mr-2 h-4 w-4" /> Dodaj zgłoszenie
        </Button>
      }
    >
      <DataTable table={table} onRowClick={(id) => navigate(`/requests/${id}`)}>
        <RequestsFiltersForm initialValues={params} currentUser={user} />
      </DataTable>
    </PageLayout>
  );
}
