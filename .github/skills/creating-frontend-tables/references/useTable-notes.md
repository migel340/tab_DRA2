useTable notes (repo-specific)

- `useTable` expects at minimum:
  - `data`: the list payload returned from `loader` or service
  - `columns`: ordered columns array exported from `columns.ts`
  - `params`: parsed table params (page, perPage, sortBy, order, filters)
- Sorting fields: use `sortBy` (string) and `order` (`asc` | `desc`) as URL search params.
- Filtering: put filter fields as additional URL params; extend `BaseTableParamsSchema` to validate them in `loader`.
- Paging: use `page` and `perPage` URL params.
- `useTable` will map URL params -> table internal helpers; components should only trigger URL updates (via `SortableHeader` or `FiltersForm`) and not hold separate table state.
- `columns` should be an ordered `export const columns = [...]` array so the `DataTable` renders columns in expected order.
- When generating column headers, prefer `SortableHeader` for sortable columns so header clicks update `sortBy`/`order` in URL and `loader` will re-run (or client code will fetch new data) accordingly.
- See example route: frontend/app/routes/personel/personel.tsx for an applied pattern.
