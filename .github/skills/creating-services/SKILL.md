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
- Expose **domain-specific** typed methods (e.g., `getPersonelById`, `fetchPersonelList`—not generic names like `getById`). Naming should reflect the entity domain and be consistent across services.
- Keep error handling consistent: throw for unexpected shapes; return undefined for 404 if that's desired.
- Document expected error cases in inline comments (e.g., "Returns undefined for 404; throws ZodError on schema mismatch; re-throws fetch errors").
- Do not perform routing or UI side effects in services.
- Unit-test parsing logic with representative raw payloads.

Validation checklist

- API responses parsed with Zod before return.
- Methods have explicit return types derived from Zod types.
- Methods use domain-specific names reflecting the entity (e.g., `getPersonelById` not `getById`).
- Service does not import UI modules or route helpers.
- **Error handling documented:** Each method includes inline comments explaining expected error cases (e.g., "Returns undefined on 404", "Throws ZodError if response doesn't match schema", "Re-throws fetch errors"). Methods clearly indicate throw vs return undefined behavior.

Connected skills

- creating-route-modules: Services are the data layer called by loaders/actions.
- creating-forms: Services return domain types used by forms and form submissions.

References

- assets/service-template.ts
- references/service-guidelines.md
