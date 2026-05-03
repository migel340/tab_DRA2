---
name: creating-services
description: Creates typed service layers that wrap API modules and parse responses with Zod. Describes WHEN to use services and how to expose typed methods.
user-invokable: false
---

Introduction

This skill prescribes a small service layer pattern that calls API modules, validates responses with Zod, and maps API shapes to domain types. Use it when adding business methods consumed by route modules or components.

<principles>
  <principle>Keep services thin: orchestrate API calls and transforms, not UI logic.</principle>
  <principle>Validate external data with Zod before exposing it to callers.</principle>
  <principle>Return typed domain values or throw on unexpected API shapes.</principle>
</principles>

Process / Workflow

- Create a service file per entity (personel-service.ts).
- Import the API client (personelApi) and Zod schemas for responses.
- Parse raw API responses with `Schema.parse(raw)` and map to domain types.
- Expose typed methods: `getById`, `getAll`, `create`, `update`, `delete`.
- Keep error handling consistent: throw for unexpected shapes; return undefined for 404 if that's desired.
- Do not perform routing or UI side effects in services.
- Unit-test parsing logic with representative raw payloads.

Validation checklist

- API responses parsed with Zod before return.
- Methods have explicit return types derived from Zod types.
- Service does not import UI modules or route helpers.
- Errors documented and consistent (throw vs return undefined).

Connected skills

- creating-route-modules: Services are the data layer called by loaders/actions.
- creating-forms: Services return domain types used by forms and form submissions.

References

- assets/service-template.ts
- references/service-guidelines.md
