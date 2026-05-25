import type { ColumnDef } from "@tanstack/react-table";
import { type Device, type DeviceType } from "~/types/device";

export const columns: ColumnDef<Device>[] = [
  {
    accessorKey: "deviceName",
    header: () => <div className="w-full">Nazwa</div>,
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "deviceType",
    header: ({ column }) => <div>Typ</div>,
    cell: ({ getValue }) => (getValue() as DeviceType).deviceTypeName,
  },
];
