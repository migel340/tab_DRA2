import { useNavigate, useLocation } from "react-router";
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type OnChangeFn,
} from "@tanstack/react-table";
import type { BaseTableParams } from "~/types/table";

interface UseAppTableProps<TData, TParams extends BaseTableParams> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  params: TParams;
}

export function useTable<TData, TParams extends BaseTableParams>({
  data,
  columns,
  params,
}: UseAppTableProps<TData, TParams>) {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const sorting: SortingState = params.sortBy
    ? [{ id: params.sortBy, desc: params.order === "desc" }]
    : [];

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    const newParams = new URLSearchParams(search);

    if (next.length > 0) {
      newParams.set("sortBy", next[0].id);
      newParams.set("order", next[0].desc ? "desc" : "asc");
    } else {
      newParams.delete("sortBy");
      newParams.delete("order");
    }

    navigate(`${pathname}?${newParams.toString()}`, { replace: true });
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualFiltering: true,
  });

  return { table };
}
