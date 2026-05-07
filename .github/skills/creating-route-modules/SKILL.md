---
name: creating-route-modules
description: Defines route module patterns and WHEN to use loaders/actions with Zod parsing and structured errors.
user-invokable: false
---

Introduction

This skill prescribes a consistent route module shape for loaders, actions, and the default component. Use it when adding new route modules under the personel routes.

<principles>
  <principle>Validate inputs in loader/action with Zod safeParse/coerce.</principle>
  <principle>Return structured fieldErrors for form-level mapping instead of throwing plain text.</principle>
  <principle>Prefer returning payloads from actions; throw Response only for transport-level status changes.</principle>
</principles>

Process / Workflow

- Export `handle` if route needs meta or guards.
- **Protecting Routes with Auth Guards:** Call auth helpers (`requireAdmin`, `requireUser`) at the start of loaders/actions to protect routes. Example from `personel.tsx` loader: `const user = await requireAdmin(request); // throws Response(401) if not authorized`. This pattern ensures authentication happens before data fetching.
- Implement `loader` to parse search params with `Schema.parse` or `safeParse`.
- Use services for data loading; avoid direct API calls in route code.
- Implement `action` to call `request.formData()` and parse with `safeParse`.
- On validation failure return `{ errors: z.flattenErrors(...).fieldErrors }` (flattened field-level errors from Zod).
- **Response vs Return:** Throw `Response` for HTTP-level errors (404, 401, 403 status codes). Return structured objects (e.g., `{ errors: {...}, success: false }`) for business/validation errors that the component can handle.
- In client, read `actionData`, show toasts on success, then navigate as needed (see personel-create.tsx pattern).
- Keep action free of redirects when the caller handles navigation; return `{ success: true, id }` when created.

Validation checklist

- Loader uses Zod parse/coerce and returns typed data.
- Action uses `safeParse` and returns `fieldErrors` when invalid.
- Service layer used for business logic; route only orchestrates.
- Actions return JSON payloads for success and validation errors.
- Responses that must be HTTP errors use `throw new Response(...)`.

Connected skills

- creating-forms: For client-side form handling and server error mapping.
- creating-services: For service usage inside loader/action.

References

- assets/loader-action-template.ts
- references/route-module-blueprint.md
