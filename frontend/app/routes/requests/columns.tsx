import type { ColumnDef } from "@tanstack/react-table";
import { ProgressField } from "~/components/ProgressField";
import { RepairStatusBadge } from "~/components/Badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import type { RequestItem } from "./requests-service";
import { useNavigate } from "react-router";

export const columns: ColumnDef<RequestItem>[] = [
  {
    accessorKey: "id",
    header: () => <div className="pl-6">Numer</div>,
    cell: ({ getValue }) => (
      <div className="pl-6 font-semibold text-gray-700">#{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Opis",
    cell: ({ getValue }) => (
      <div className="max-w-[250px] text-gray-500 text-sm truncate" title={getValue() as string}>
        {getValue() as string}
      </div>
    ),
  },
  {
    id: "clientDevice",
    header: "Klient & Urządzenie",
    cell: ({ row }) => {
      const { client, device } = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-700">{client}</span>
          <span className="text-xs text-gray-500">{device}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    header: "Postęp",
    cell: ({ getValue }) => <ProgressField value={getValue() as number} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <div className="flex">
        <RepairStatusBadge status={getValue() as any} />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const requestId = row.original.id;

      return (
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 text-gray-500 border-gray-200 hover:bg-gray-100 ml-auto flex"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/requests/${requestId}/activities/new`);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      );
    }
  },
];