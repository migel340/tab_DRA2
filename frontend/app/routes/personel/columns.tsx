import type { ColumnDef } from "@tanstack/react-table";
import { useFetcher } from "react-router";
import { AccountStatusBadge } from "~/components/Badge";
import DeleteButton from "~/components/DeleteButton";
import { SortableHeader } from "~/components/SortableHeader";
import { useActionToast } from "~/hooks/useActionToast";
import type { Personel } from "~/types/personel";
import type { AccountStatus } from "~/types/status";

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
  {
    id: "actions",
    cell: ({ row }) => {
      const personel = row.original;
      const fetcher = useFetcher();
      useActionToast(fetcher.data);
      return (
        <DeleteButton
          confirmDescription={`Czy na pewno chcesz usunąć ${personel.firstName} ${personel.surname}? Operacja jest nieodwracalna.`}
          confirmTitle="Usuwanie Użytkownika"
          onConfirm={() => {
            fetcher.submit(null, {
              method: "DELETE",
              action: `/personel/${personel.id}/delete`,
            });
          }}
          size={"icon"}
          disabled={fetcher.state !== "idle"}
        />
      );
    },
  },
];
