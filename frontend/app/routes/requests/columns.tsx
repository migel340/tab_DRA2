import type { ColumnDef } from "@tanstack/react-table";
import { ProgressField } from "~/components/ProgressField";
import { RepairStatusBadge } from "~/components/Badge";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import type { RequestDB } from "~/types/requests";
import { useNavigate } from "react-router";

export const columns: ColumnDef<RequestDB>[] = [
  {
    accessorKey: "id",
    header: () => <div className="pl-6">Numer</div>,
    cell: ({ getValue }) => (
      <div className="pl-6 font-semibold text-gray-700">
        #{getValue() as number}
      </div>
    ),
  },
  {
    accessorKey: "dateRegistration",
    header: ({ column }) => <SortableHeader label="Data" column={column} />,
    cell: ({ getValue }) => {
      const val = getValue() as string;
      return (
        <span className="text-gray-600">
          {val ? new Date(val).toLocaleDateString("pl-PL") : "Brak"}
        </span>
      );
    },
  },
  {
    id: "manager",
<<<<<<< HEAD
    accessorFn: (row) =>
      row.manager ? `${row.manager.firstName} ${row.manager.surname}` : "Brak",
=======
    accessorFn: (row) => row.managerId ? `ID: ${row.managerId}` : "Brak",
>>>>>>> 5fc660f (requests display device name and date fixed)
    header: ({ column }) => <SortableHeader label="Manager" column={column} />,
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "description",
    header: "Opis",
    cell: ({ getValue }) => (
<<<<<<< HEAD
      <div
        className="max-w-[250px] text-gray-500 text-sm truncate"
        title={getValue() as string}
      >
=======
      <div className="max-w-[250px] text-gray-600 truncate" title={getValue() as string}>
>>>>>>> 5fc660f (requests display device name and date fixed)
        {getValue() as string}
      </div>
    ),
  },
  {
    id: "clientDevice",
    header: "Klient & Urządzenie",
    cell: ({ row }) => {
      const device = row.original.device;
      const deviceName = device?.deviceName || "Brak urządzenia";
      return (
        <div className="flex flex-col">
          <span className="text-xs text-gray-600">{deviceName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "progress",
    accessorFn: () => 0,
    header: ({ column }) => <SortableHeader label="Postęp" column={column} />,
    cell: ({ getValue }) => <ProgressField value={(getValue() as number) || 0} />,
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
    },
  },
];
