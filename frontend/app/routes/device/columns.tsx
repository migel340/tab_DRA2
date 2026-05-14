import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "~/components/SortableHeader";
import { DEVICE_TYPE_LABELS, type Device } from "~/types/device";

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "name",
    header: () => <div className="w-full">Nazwa</div>,
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => <SortableHeader label="Typ" column={column} />,
    cell: ({ getValue }) =>
      DEVICE_TYPE_LABELS[getValue() as keyof typeof DEVICE_TYPE_LABELS],
  },
];
