import React from "react";
import { SortableHeaderExample } from "./sortable-header.a11y.example";
import { cn } from "~/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";

type Row = { id: string; name: string };
const rows: Row[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

export function DataTableExample({
  onRowClick = (r: Row) => {},
}: {
  onRowClick?: (r: Row) => void;
}) {
  function onRowKeyDown(e: React.KeyboardEvent, row: Row) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onRowClick(row);
    }
  }

  return (
    <Table className={cn("min-w-full")}>
      <TableHeader>
        <TableRow role="row">
          <TableHead>
            <SortableHeaderExample />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow
            key={r.id}
            role="row"
            tabIndex={0}
            onClick={() => onRowClick(r)}
            onKeyDown={(e) => onRowKeyDown(e, r)}
            className={cn("cursor-pointer")}
          >
            <TableCell role="cell">{r.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
