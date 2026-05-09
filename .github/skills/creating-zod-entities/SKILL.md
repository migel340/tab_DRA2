---
name: creating-zod-entities
description: "Creates repository-consistent Zod schemas for entities. Use when adding or updating entity types, form input shapes, API payload transforms, and service/route validation in frontend/app/types."
user-invokable: false
---

Introduction

This skill codifies the repo's Zod schema layering and validation boundaries so agents produce consistent, transform-aware schemas modeled after `frontend/app/types/personel.ts`.

<principles>

<reuse-primitives>
Prefer reuse: import shared primitives and enums (e.g. `~/lib/schema`, `~/types/status`) instead of recreating validators.
</reuse-primitives>

<layered-schemas>
Follow the repo's canonical layered schema pattern (DB, form, API transform, canonical, list/detail) for predictable types and transforms.
</layered-schemas>

<input-output>
Be transform-aware: use `z.input<>` for form input types and `z.output<>` for API/domain outputs; prefer explicit `.transform` for mapping fields (status <-> active).
</input-output>

<validation-boundaries>
Enforce clear boundaries: actions/loaders use `safeParse` and return flattened field errors; services use `.parse()` for server responses.
</validation-boundaries>

</principles>

Process / Workflow

- [ ] 1. Inspect the existing entity example: `frontend/app/types/personel.ts` for patterns and naming.
- [ ] 2. Identify shared primitives/enums to import (e.g. `~/lib/schema`, `~/types/status`, `~/types/table`).
- [ ] 3. Create `EntityDbSchema` as the ground truth reflecting backend shape.
- [ ] 4. Derive `EntityCreateFormSchema` and `EntityUpdateFormSchema` from DB schema (omit/extend as needed); coerce string ids with `z.coerce.number()`.
- [ ] 5. Add `EntityCreateApiSchema` and `EntityUpdateApiSchema` using `.transform()` to map form fields to DB payload (e.g. status -> active).
- [ ] 6. Define `EntitySchema` as the canonical client-facing transform of DB (use `.transform()` where domain differs).
- [ ] 7. Export `EntityListSchema` (array) and `EntityDetailSchema` (single) and derive TypeScript types using `z.input` / `z.output` appropriately.
- [ ] 8. Update route loaders/actions to `safeParse` form input and services to `.parse()` responses (see validation checklist).
- [ ] 9. Add unit-friendly comments and a small example in `assets/entity-schema.template.ts`.

Validation checklist

- Reused shared primitives/enums instead of duplicating validators.
- DB schema mirrors backend fields (types and required vs optional).
- Form schemas use `z.coerce` where inputs arrive as strings (ids, page, limit).
- API schemas use `.transform()` to map form shape to DB payload (and vice versa for canonical schema).
- Types: `z.input<typeof ApiSchema>` for form inputs; `z.output<typeof ApiSchema>` for payloads; `z.output<typeof EntitySchema>` for domain types.
- Route/loader: use `Schema.safeParse(data)` and return flattened field errors to the client.
- Service: use `Schema.parse(raw)` to assert server responses.
- Export list/detail variants: `EntityListSchema = z.array(EntitySchema)` and `EntityDetailSchema = EntitySchema`.

Connected Skills

- No local connected skills are required for this artifact. Add references to workspace skills here when available.

References: ./references/entity-schema-blueprint.md, ./references/naming-and-type-matrix.md, ./references/validation-boundaries.md, ./assets/entity-schema.template.ts
