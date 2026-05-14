import type { ReactNode } from "react";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table,
} from "./ui/table";
import { flexRender, type Table as TableType } from "@tanstack/react-table";
import { DataTablePagination } from "./DataTablePagination";

interface DataTableProps<TData> {
  table: TableType<TData>;
  children?: ReactNode;
  onRowClick?: (objectId: number | string) => void;
}

export function DataTable<TData extends { id: number | string }>({
  table,
  children,
  onRowClick,
}: DataTableProps<TData>) {
  return (
    <div className="overflow-hidden rounded-md border">
      {children && <div className="p-5">{children}</div>}
      <Table>
        <TableHeader className="bg-stone-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  if (
                    target.closest("button") ||
                    target.closest("[role='dialog']") ||
                    target.closest("[data-slot='alert-action']") ||
                    target.closest("[data-slot='alert-dialog-overlay']")
                  ) {
                    return;
                  }
                  onRowClick?.(row.original.id);
                }}
                data-state={row.getIsSelected() && "selected"}
                className={`${onRowClick && "cursor-pointer"}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}
