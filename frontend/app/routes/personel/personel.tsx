import PageLayout from "~/layouts/PageLayout";
import { columns } from "./columns";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "~/components/DataTable";
import type { Route } from "./+types/personel";
import { personelService } from "~/routes/personel/personel-service";
import { FilterSchema } from "./schema";
import { useNavigate } from "react-router";
import { PersonelFiltersForm } from "./personel-filters-form";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const params = FilterSchema.parse(Object.fromEntries(url.searchParams));

  const personelList = await personelService.fetchPersonelList(params);
  return { personelList, params };
}

export default function Personel({ loaderData }: Route.ComponentProps) {
  const { personelList, params } = loaderData;
  const navigate = useNavigate();

  const sorting = params.sortBy
    ? [{ id: params.sortBy, desc: params.order === "desc" }]
    : [];

  const table = useReactTable({
    columns,
    data: personelList,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualSorting: true,
    state: {
      sorting,
    },

    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const urlParams = new URLSearchParams(window.location.search);

      if (next.length > 0) {
        urlParams.set("sortBy", next[0].id);
        urlParams.set("order", next[0].desc ? "desc" : "asc");
      } else {
        urlParams.delete("sortBy");
        urlParams.delete("order");
      }
      navigate(`?${urlParams.toString()}`, { replace: true });
    },
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
      <DataTable table={table} onRowClick={(id) => console.log(id)}>
        <PersonelFiltersForm initialValues={params} />
      </DataTable>
    </PageLayout>
  );
}
