import type { ColumnDef } from "@tanstack/react-table";
import { AccountStatusBadge } from "~/components/Badge";
import { SortableHeader } from "~/components/SortableHeader";
import type { Personel } from "~/types/personel";
import type { AccountStatus } from "~/types/status";

export const columns: ColumnDef<Personel>[] = [
  {
    id: "fullName",
    header: () => <div className="w-full pl-6">Staff Member</div>,
    accessorFn: (row) => `${row.firstName} ${row.surname}`,
    cell: ({ row }) => {
      const { firstName, surname } = row.original;
      return (
        <div className="font-medium pl-6">
          {firstName} {surname}
        </div>
      );
    },
  },

  {
    accessorKey: "username",
    header: ({ column }) => <SortableHeader label="Login" column={column} />,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => <SortableHeader label="Role" column={column} />,
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return role;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as AccountStatus;
      return (
        <div className="flex items-center">
          <AccountStatusBadge status={status} />
        </div>
      );
    },
  },
];
