import type { ColumnDef } from "@tanstack/react-table";
import { SortableHeader } from "~/components/SortableHeader";
import type { Client } from "~/types/client";

export const columns: ColumnDef<Client>[] = [
  {
    id: "fullName",
    header: () => <div className="w-full">Klient</div>,
    accessorFn: (row) => {
      const parts = [row.firstName, row.secondName, row.surname].filter(
        Boolean,
      );
      return parts.join(" ");
    },
    cell: ({ row }) => {
      const { firstName, secondName, surname } = row.original;
      const parts = [firstName, secondName, surname].filter(Boolean);
      return <div className="font-medium">{parts.join(" ")}</div>;
    },
  },

  {
    accessorKey: "tel",
    header: ({ column }) => <SortableHeader label="Telefon" column={column} />,
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() as string}</span>
    ),
  },

  {
    accessorKey: "birthDate",
    header: ({ column }) => (
      <SortableHeader label="Data urodzenia" column={column} />
    ),
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return new Date(date).toLocaleDateString("pl-PL");
    },
  },

  {
    accessorKey: "deviceCount",
    header: ({ column }) => (
      <SortableHeader label="Liczba urządzeń" column={column} />
    ),
    cell: ({ getValue }) => getValue(),
  },
];
