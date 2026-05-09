import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import type { Column, RowData } from "@tanstack/react-table";

interface SortableHeaderProps<TData extends RowData, TValue = unknown> {
  label: string;
  column: Column<TData, TValue>;
}

export function SortableHeader<TData extends RowData, TValue = unknown>({
  label,
  column,
}: SortableHeaderProps<TData, TValue>) {
  const isSorted = column.getIsSorted();
  const isAsc = column.getIsSorted() === "asc";
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(isAsc)}
      className="-ml-3 h-8 data-[state=open]:bg-accent"
    >
      <span>{label}</span>
      {isSorted ? (
        isAsc ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}
