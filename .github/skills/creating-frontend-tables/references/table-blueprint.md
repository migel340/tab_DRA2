Table page blueprint

Directory and file shapes for a list page (canonical example: frontend/app/routes/personel/personel.tsx)

Example structure:

frontend/app/routes/<resource>/

- <resource>.tsx # Route module: exports `loader` and default component
- columns.ts # Exports ordered `columns` array for DataTable
- <resource>-service.ts # Service that fetches data from backend
- filters-form.tsx # `FiltersForm` component extending BaseTableParamsSchema
- schema.tsx (optional) # Zod schemas for create/edit if needed

Route module responsibilities:

- Export `loader` that:
  - Parses search params (Zod `safeParse`) against a schema that extends `BaseTableParamsSchema` with route-specific filters
  - Calls the service with parsed params
  - Returns `{ data, params }`
- Default component that:
  - Calls `useLoaderData()` to get `{ data, params }`
  - Imports `columns` and `FiltersForm`
  - Uses `useTable({ data, columns, params })` to wire DataTable and pagination

Columns file:

- Export `columns` as a top-level `export const columns = [...]` array
- Use `SortableHeader` for columns that are sortable, making header UI responsible for toggling `sortBy` and `order` in URL params

Filters form:

- New component that extends `BaseTableParamsSchema`
- Uses `react-hook-form` + `zodResolver`
- On submit, writes params to URL via `useSubmit` or `useNavigate` (prefer `useSubmit` with `Form` when possible)

Notes:

- Keep all imports rooted with `~` (e.g., `~components/DataTable`, `~lib/schema`).
- Maintain single source of truth: URL search params drive table state.
