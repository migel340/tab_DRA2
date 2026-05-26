---
name: creating-frontend-tables
description: "Creates repository-consistent frontend tables using React Router route modules, URL param state, `useTable`, `SortableHeader`, and a separate filters form extending `BaseTableParamsSchema`. Use when adding or updating list pages under `frontend/app/routes`."
user-invokable: false
---

# Introduction

One-paragraph, actionable guidance for creating list pages that match this repository's conventions (see canonical example: `frontend/app/routes/personel/personel.tsx`). Keep decisions deterministic and URL-driven.

<principles>
<use-tilde-imports>Always import app code using `~` (app root) so generated modules match Vite/tsconfig path aliases used in the repo.</use-tilde-imports>
<loader-contract>Route modules MUST export a `loader` that parses URL params with Zod using `safeParse` (extending `BaseTableParamsSchema`), fetches data via the route service, and returns `{ data, params }` for the route component.</loader-contract>
<url-state>All table state (filters, `sortBy`, `order`, page, perPage) lives in URL search params. When users filter, sort, or paginate, the form submits via React Router (client-side navigation, no full HTML reload), which re-runs the loader and refreshes the table. UI components read/write params via `useNavigate`/`useSubmit` or helpers; `useTable` consumes them.</url-state>
<separation-of-concerns>Keep `columns` in a separate `columns.ts` file (ordered array). Put filters UI in a separate `FiltersForm` component that extends `BaseTableParamsSchema` and updates the URL on submit.</separation-of-concerns>
<sortable-headers>Use `SortableHeader` for clickable headers; it toggles `order` and sets `sortBy` in URL params.</sortable-headers>
</principles>

# Process / Workflow

Checklist for implementing a new list page (copy into PR description):

- [ ] Create route module at `frontend/app/routes/<resource>/<resource>.tsx` exporting `loader` and default component.
- [ ] In `loader`: import `BaseTableParamsSchema` (from `~lib/schema`), extend it with route-specific filters, parse `request.url` search params using Zod `safeParse`, call service (from `~routes/<resource>/<resource>-service`), return `{ data, params }`.
- [ ] Create service file under `frontend/app/routes/<resource>/<resource>-service.ts` that performs the API call and returns typed data.
- [ ] Create `columns.ts` alongside route module that exports an ordered `columns` array compatible with `DataTable` and referencing `SortableHeader` for sortable columns.
- [ ] Create a `FiltersForm` component under the route folder that extends `BaseTableParamsSchema`, uses `react-hook-form` + `zodResolver`, and includes hidden `<input type="hidden">` fields for sort state (`sortBy`/`order`) so filter submission preserves sort state in URL.
- [ ] Use `useTable` inside the route component: pass `data`, `columns`, and `params` from loader; keep UI stateless with respect to table state (read from URL via `useTable`). **How `useTable` manages state:** It reads URL search params via `useLocation()`, extracts current page/limit/sort/filters, and provides `updateParams(newParams)` that navigates via `useNavigate()` to update the URL.
- [ ] Ensure sorting and paging change only URL params (no local-only state). Use `SortableHeader` and `useSubmit`/`useNavigate` helpers to update `sortBy` and `order`.
- [ ] Add tests or manual verification steps: load the page, toggle header sorting, apply filters, confirm URL changes and data updates.

# Validation checklist

- Frontmatter: skill name matches folder `creating-frontend-tables`
- Uses `~` imports in examples and templates
- `loader` example included in references demonstrates `safeParse` extending `BaseTableParamsSchema`
- Templates export `columns` as ordered array
- `SortableHeader` template toggles `order` and updates `sortBy` in URL
- Filters form template extends `BaseTableParamsSchema`, uses `react-hook-form` + `zodResolver`, and updates URL params via `useSubmit`/`Form`
- References include canonical example path: `frontend/app/routes/personel/personel.tsx`

# Connected Skills

- creating-zod-entities — for patterns on building Zod schemas (use when extending `BaseTableParamsSchema`)
- tsh-creating-skills — follow its guidance for structure and conciseness when editing this SKILL.md

# References (files created by this skill)

- ./references/table-blueprint.md
- ./references/useTable-notes.md
- ./assets/columns.template.ts
- ./assets/SortableHeader.template.tsx
- ./assets/filters-form.template.tsx
