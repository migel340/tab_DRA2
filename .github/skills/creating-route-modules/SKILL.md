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
- Implement `loader` to parse search params with `Schema.parse` or `safeParse`.
- Use services for data loading; avoid direct API calls in route code.
- Implement `action` to call `request.formData()` and parse with `safeParse`.
- On validation failure return `{ fieldErrors, formErrors }` where `fieldErrors` is flattened.
- Throw `Response` for non-JSON errors or to set status codes for not-found/forbidden.
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
