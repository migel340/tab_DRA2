import type { ColumnDef } from "@tanstack/react-table";
import { AccountStatusBadge } from "~/components/Badge";
import DeleteButton from "~/components/DeleteButton";
import { SortableHeader } from "~/components/SortableHeader";
import type { Personel } from "~/types/personel";

export const columns: ColumnDef<Personel>[] = [
  {
    id: "fullName",
    header: () => <div className="w-full">Staff Member</div>,
    accessorFn: (row) => `${row.firstName} ${row.surname}`,
    cell: ({ row }) => {
      const { firstName, surname } = row.original;
      return (
        <div className="font-medium">
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
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <div className="flex items-center">
          <AccountStatusBadge status={active ? "ACTIVE" : "INACTIVE"} />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const personel = row.original;
      return (
        <DeleteButton size={"icon"} onClick={() => console.log(personel.id)} />
      );
    },
  },
];
