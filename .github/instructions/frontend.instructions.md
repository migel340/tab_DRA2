---
name: Frontend App Conventions
description: Concise repository-specific rules for React Router frontend code under frontend/app/
applyTo: frontend/app/**/*.{ts,tsx}
---

# Frontend App Conventions

- In route modules, keep the React Router shape: optional `handle`, `loader`/`action` as needed.
- Define `handle.breadcrumb` in page routes used by nested layouts (for example `personel` and `requests`).
- Parse URL params and query params in `loader` with Zod (`parse`/`safeParse`) before calling services.
- Parse `FormData` in `action` with Zod schemas and return structured field errors from `z.flattenError(...)`.
- Keep route schemas co-located with the route folder and build list/filter schemas by extending `BaseTableParamsSchema`.
- Keep API calls and business/data transforms in service modules (for example `personel-service.ts`), not in React components.
- Build forms with `react-hook-form` + `zodResolver`, and use `Controller` for composed fields (SearchBar, Selects, custom inputs).
- Submit route data with React Router primitives (`useSubmit` and/or `Form`) instead of ad-hoc request handling.
- Keep table sorting and filtering in URL search params, aligned with `useTable` and hidden `sortBy`/`order` fields.
- Use `~` imports for cross-folder `frontend/app` modules; keep relative imports only for same-folder files.
- Route modules should keep default exports for page components; preserve local export style in existing component files (do not churn between named/default unless refactor requires it).
- Align styling with existing modules: use tokens from `app.css` and `cn()` composition patterns.
- Keep auth and role-driven navigation behavior consistent with existing helpers/modules (`lib/auth.ts` and `config/navigation.tsx`).

## Avoid

- Putting fetch/transform/business logic directly in route components.
- Reading raw `params`, `searchParams`, or `formData` without Zod validation.
- Using deep relative imports like `../../../` when a `~` alias import is available.
- Duplicating role checks/navigation filtering in random components instead of reusing existing auth/navigation patterns.
