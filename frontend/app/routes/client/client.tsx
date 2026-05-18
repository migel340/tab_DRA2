import PageLayout from "~/layouts/PageLayout";
import { columns } from "./columns";
import { DataTable } from "~/components/DataTable";
import type { Route } from "./+types/client";
import { clientService } from "~/routes/client/client-service";
import { ClientFilterSchema } from "./schema";
import { useNavigate } from "react-router";
import { ClientFiltersForm } from "./client-filters-form";
import { useTable } from "~/hooks/useTable";
import { requireManager } from "~/lib/auth.server";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireManager(request);

  const url = new URL(request.url);
  const rawParams = Object.fromEntries(url.searchParams);
  const parsedParams = ClientFilterSchema.safeParse(rawParams);
  const params = parsedParams.success
    ? parsedParams.data
    : ClientFilterSchema.parse({});

  const clientList = await clientService.fetchClientList(request, params);
  console.log(clientList);
  return { clientList, params };
}

export default function Client({ loaderData }: Route.ComponentProps) {
  const { clientList, params } = loaderData;
  const navigate = useNavigate();

  const { table } = useTable({
    data: clientList.data,
    columns,
    params: clientList.meta,
    pageCount: clientList.meta.totalPages,
  });

  return (
    <PageLayout
      title="Klienci"
      actions={
        <Button
          variant={"secondary"}
          onClick={() => navigate("/client/create")}
        >
          <Plus />
          Dodaj klienta
        </Button>
      }
    >
      <DataTable table={table} onRowClick={(id) => navigate(`/client/${id}`)}>
        <ClientFiltersForm initialValues={params} />
      </DataTable>
    </PageLayout>
  );
}
