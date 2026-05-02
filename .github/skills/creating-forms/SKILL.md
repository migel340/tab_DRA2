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
- Disable submit button while `formState.isSubmitting` to avoid duplicate posts.
- On submit use `useSubmit` or the framework `<Form>` to send data to the route action.
- Map server `fieldErrors` into `setError(name, { message })` for each field.
- Flatten nested server errors into single-level `fieldErrors` before mapping.
- Centralize server->client error mapping in a small helper used across forms.
- Ensure accessible labels, error messaging, and focus on first error.

Validation checklist

- Zod schema defined and exported beside the form.
- Type exported with `z.infer` and used by `useForm` generic.
- `zodResolver` configured on `useForm`.
- `Controller` used for composed fields.
- Submit disabled during `isSubmitting`.
- Server errors flattened and set via `setError`.
- Form uses `useSubmit` or framework form wrapper for route submissions.

Connected skills

- creating-zod-entities: For consistent Zod schemas and types.
- creating-route-modules: For wiring loader/action and server error shape.

References

- assets/form-template.tsx
- references/form-patterns.md
