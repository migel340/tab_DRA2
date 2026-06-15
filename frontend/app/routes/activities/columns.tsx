import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "~/components/SortableHeader";
import type { ActivitType, Activity } from "./schema";
import { RepairStatusBadge } from "~/components/Badge";
import type { RepairStatus } from "~/types/status";
import type { PersonelLookup } from "~/types/personel";

export const columns: ColumnDef<Activity>[] = [
  {
    id: "index",
    header: ({ column }) => <SortableHeader label="Lp." column={column} />,
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">{row.index + 1}</div>
    ),
  },

  {
    accessorKey: "seqNo",
    cell: ({ getValue }) => (
      <div className="font-medium text-gray-700">
        {(getValue() as string) ?? "-"}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableHeader label="Typ" column={column} />,
    cell: ({ getValue }) => {
      const type = getValue() as ActivitType;
      return (
        <div className="font-medium text-gray-900">{type?.actType ?? "-"}</div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => <SortableHeader label="Opis" column={column} />,
    cell: ({ getValue }) => (
      <div
        className="max-w-[250px] text-gray-500 text-sm truncate"
        title={getValue() as string}
      >
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "executor",
    header: ({ column }) => (
      <SortableHeader label="Wykonawca" column={column} />
    ),
    cell: ({ getValue }) => {
      const executor = getValue() as PersonelLookup;
      return <span className="text-gray-700">{executor?.name ?? "-"}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader label="Status" column={column} />,
    cell: ({ getValue }) => (
      <RepairStatusBadge status={getValue() as RepairStatus} />
    ),
  },
  {
    accessorKey: "dateRegistration",
    header: ({ column }) => (
      <SortableHeader label="Utworzono" column={column} />
    ),
    cell: ({ getValue }) => (
      <span className="text-gray-500">
        {new Date(getValue() as string).toLocaleDateString("pl-PL")}
      </span>
    ),
  },
  {
    accessorKey: "dateFinisihedCancelled",
    header: ({ column }) => (
      <SortableHeader label="Zakończono" column={column} />
    ),
    cell: ({ getValue }) => {
      const date = getValue()
        ? new Date(getValue() as string).toLocaleDateString("pl-PL")
        : "-";
      return <span className="text-gray-500">{date}</span>;
    },
  },
];
