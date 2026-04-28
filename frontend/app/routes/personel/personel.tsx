import PageLayout from "~/layouts/PageLayout";
import { columns } from "./columns";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "~/components/DataTable";
import type { Route } from "./+types/personel";
import { personelService } from "~/services/personelService";
import SearchBar from "~/components/SearchBar";

export const handle = {
  breadcrumb: () => "Lista",
};

export async function loader() {
  const personelList = await personelService.fetchPersonelList();

  return { personelList };
}

export default function Personel({ loaderData }: Route.ComponentProps) {
  const { personelList } = loaderData;

  const table = useReactTable({
    columns,
    data: personelList,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <PageLayout title="Użytkownicy">
      <DataTable table={table} onRowClick={(id) => console.log(id)}>
        <SearchBar />
      </DataTable>
    </PageLayout>
  );
}
