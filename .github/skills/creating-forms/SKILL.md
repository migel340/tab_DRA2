---
name: creating-forms
description: Creates concise form components and patterns. Explains WHAT to use and WHEN to apply react-hook-form + zod in route-based forms.
user-invokable: false
---

Introduction

This skill documents a compact, repository-consistent approach for building forms in route modules. Use it when adding or updating forms (create/edit) under the personel routes.

<principles>
  <principle>Validate close to inputs with Zod and react-hook-form.</principle>
  <principle>Derive types from schemas to keep runtime and types in sync.</principle>
  <principle>Map server errors into flattened fieldErrors for UI consumption.</principle>
</principles>

Process / Workflow

- Create a Zod schema for inputs and export a type via `z.infer`.
- Use `useForm({ resolver: zodResolver(schema) })` and derive TS type from schema.
- Use `Controller` for composed/custom fields (Select, Combobox).
- Disable submit button while `formState.isSubmitting` to avoid duplicate posts: `<button disabled={formState.isSubmitting}>Submit</button>`.
- On submit use `useSubmit` or the framework `<Form>` to send data to the route action.
- **Server Error Mapping (Two Patterns):**
  - **(A) Field-level `setError` mapping (Recommended):** Read `actionData.errors` from route action, flatten nested errors, and call `setError(fieldName, { message })` for each field. Centralize this logic in a small helper used across forms.
  - **(B) Bulk notification with `useActionToast` (Current Codebase Pattern):** Use `useActionToast()` hook to show bulk toast notifications for server errors. See `personel-form.tsx` for implementation.
- Access `actionData` from the route action using `const actionData = useActionData<typeof action>();` to read validation errors or success payloads.
- Flatten nested server errors into single-level `fieldErrors` before mapping.
- Ensure accessible labels, error messaging, and focus on first error.

Validation checklist

- Zod schema defined and exported beside the form.
- Type exported with `z.infer` and used by `useForm` generic.
- `zodResolver` configured on `useForm`.
- `Controller` used for composed fields.
- Submit disabled during `isSubmitting`.
- Server errors read via `useActionData()` and mapped into form state (either via field-level `setError` or bulk `useActionToast` notification).
- Form uses `useSubmit` or framework form wrapper for route submissions.
- Action payload types are explicitly imported (e.g., `import { action } from './personel-create'`) to enable `useActionData<typeof action>()` typing.

Connected skills

- creating-zod-entities: For consistent Zod schemas and types.
- creating-route-modules: For wiring loader/action and server error shape.

References

- assets/form-template.tsx
- references/form-patterns.md
