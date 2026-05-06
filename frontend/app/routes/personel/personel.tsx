import PageLayout from "~/layouts/PageLayout";
import { columns } from "./columns";
import { DataTable } from "~/components/DataTable";
import type { Route } from "./+types/personel";
import { personelService } from "~/routes/personel/personel-service";
import { PersonelFilterSchema } from "./schema";
import { useNavigate } from "react-router";
import { PersonelFiltersForm } from "./personel-filters-form";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { useTable } from "~/hooks/useTable";
import { requireAdmin } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);

  const url = new URL(request.url);
  const rawParams = Object.fromEntries(url.searchParams);
  const parsedParams = PersonelFilterSchema.safeParse(rawParams);
  const params = parsedParams.success
    ? parsedParams.data
    : PersonelFilterSchema.parse({});

  const personelList = await personelService.fetchPersonelList(request, params);
  return { personelList, params };
}

export default function Personel({ loaderData }: Route.ComponentProps) {
  const { personelList, params } = loaderData;
  const navigate = useNavigate();

  const { table } = useTable({
    data: personelList.data,
    columns,
    params: personelList.meta,
    pageCount: personelList.meta.totalPages,
  });

  return (
    <PageLayout
      title="Użytkownicy"
      actions={
        <Button
          variant={"secondary"}
          onClick={() => navigate("/personel/create")}
        >
          <Plus />
          Dodaj użytkownika
        </Button>
      }
    >
      <DataTable table={table} onRowClick={(id) => navigate(`/personel/${id}`)}>
        <PersonelFiltersForm initialValues={params} />
      </DataTable>
    </PageLayout>
  );
}
