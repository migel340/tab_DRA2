import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ActivityItem } from "./activities-service";

export const columns: ColumnDef<ActivityItem>[] = [
  {
    id: "index",
    header: "Lp.",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "type",
    header: "Typ",
    cell: ({ getValue }) => (
      <div className="font-medium text-gray-900">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "desc",
    header: "Opis",
    cell: ({ getValue }) => (
      <div className="max-w-[250px] text-gray-500 text-sm truncate" title={getValue() as string}>
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "executor",
    header: "Wykonawca",
    cell: ({ getValue }) => (
      <span className="text-gray-700">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge
        variant="outline"
        className={`rounded-full font-medium px-3 py-0.5 ${
          (getValue() as string) === "Aktywne"
            ? "bg-green-50 text-green-600 border-green-200"
            : "bg-gray-100 text-gray-600 border-gray-200"
        }`}
      >
        {getValue() as string}
      </Badge>
    ),
  },
  {
    accessorKey: "created",
    header: "Data utworzenia",
    cell: ({ getValue }) => (
      <span className="text-gray-500">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "finished",
    header: "Data zakończenia",
    cell: ({ getValue }) => (
      <span className="text-gray-500">{getValue() as string}</span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      );
    },
  },
];
