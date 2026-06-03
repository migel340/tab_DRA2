import PageLayout from "~/layouts/PageLayout";
import { DataTable } from "~/components/DataTable";
import { columns } from "./columns";
import type { Route } from "./+types/requests";
import { requestsService } from "./requests-service";
import { RequestsFilterSchema } from "./schema";
import { redirect, useNavigate } from "react-router";
import { RequestsFiltersForm } from "./requests-filters-form";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useTable } from "~/hooks/useTable";
import { requireManager } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  const loggedUser = await requireManager(request);
  const url = new URL(request.url);

  if (!url.searchParams.has("status") && !url.searchParams.has("manager")) {
    url.searchParams.set("status", "REGISTERED");
    url.searchParams.set("manager", loggedUser.id.toString());
    url.searchParams.set("dateRange", "all");
    
    return redirect(`/requests?${url.searchParams.toString()}`);
  }

  const params = RequestsFilterSchema.parse(
    Object.fromEntries(url.searchParams),
  );
<<<<<<< HEAD

=======
>>>>>>> 2476a20 (filtering requests)
  const requestsList = await requestsService.fetchRequestsList(request, params);

  return { requestsList, params, loggedUserId: loggedUser.id};
}

export default function Requests({ loaderData }: Route.ComponentProps) {
<<<<<<< HEAD
  const { requestsList, params, user } = loaderData;
=======
  const { requestsList, params, loggedUserId } = loaderData;
>>>>>>> 2476a20 (filtering requests)
  const navigate = useNavigate();

  const { table } = useTable({
    data: requestsList.data || [],
    columns,
    params,
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
<<<<<<< HEAD
        <RequestsFiltersForm initialValues={params} currentUser={user} />
=======
        <RequestsFiltersForm initialValues={params} loggedUserId={loggedUserId} />
>>>>>>> 2476a20 (filtering requests)
      </DataTable>
    </PageLayout>
  );
}
