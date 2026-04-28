import type { ColumnDef } from "@tanstack/react-table";
import DeleteButton from "~/components/DeleteButton";
import { Badge } from "~/components/ui/badge";
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return role;
    },
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <div className="flex items-center">
          <Badge
            className={` ${active ? "px-4 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"}`}
          >
            {active ? "Aktywny" : "Nieaktywny"}
          </Badge>
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
