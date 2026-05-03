import React from "react";
import SortableHeader from "~/components/SortableHeader";

// Minimal columns array compatible with DataTable used in this repo.
// Replace `name`, `email` with real fields from your entity.
export const columns = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column, sortBy, order, setSort }: any) => (
      <SortableHeader
        title="Name"
        field="name"
        currentSort={sortBy}
        currentOrder={order}
        onSortChange={(field: string, nextOrder: "asc" | "desc") =>
          setSort(field, nextOrder)
        }
      />
    ),
  },
  {
    id: "email",
    accessorKey: "email",
    header: () => <span>Email</span>,
  },
];

export type Columns = typeof columns;
