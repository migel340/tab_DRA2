---
name: creating-ui-primitives
description: "Defines UI primitives and accessibility patterns for building accessible, reusable frontend components. Use when implementing or updating shared components (e.g., `SortableHeader`, `DataTable`) to ensure consistent ARIA, keyboard, and focus behaviors across the repository."
user-invokable: false
---

Introduction

This skill encodes repository-specific UI primitive patterns and accessibility rules for building and reviewing shared frontend components. Use it when adding, refactoring, or reviewing `components/ui/*` primitives such as `SortableHeader` and `DataTable`.
This skill prefers shadcn primitives available under `~/components/ui` and recommends using those components as building blocks when implementing UI primitives.

## Current Implementation Status

**Currently Implemented in Codebase:**

- Semantic HTML markup (`<table>`, `<thead>`, `<tbody>`, `<button>` for headers)
- Keyboard navigation and focus visibility (tab order, visible focus outlines via `cn()` utility)
- Basic button semantics and screen reader labeling

**Aspirational / Planned for Future:**

- `aria-sort` attributes on sortable headers
- `aria-live` regions for announcements on sort/filter changes
- Dynamic focus management and screen reader announcements for state changes
- Full WCAG 2.1 AA live region integration

**Note:** When implementing new primitives, use semantic markup first. ARIA attributes like `aria-sort` and `aria-live` are documented below as target best practices; current implementations in `SortableHeader.tsx` and `DataTable.tsx` provide keyboard and semantic HTML foundation but do not yet include these advanced accessibility features.

<principles>
<principle id="semantic-markup">Always prefer semantic HTML and explicit ARIA only when semantics are insufficient. Use `<table>`, `<button>`, `<thead>`, `<tbody>`, and roles like `row`/`cell` first, then augment with ARIA attributes.</principle>
<principle id="keyboard-first">All interactive primitives must be operable by keyboard: logical tab order, `tabIndex`, clear `:focus` styles, and explicit `onKeyDown` handlers for Enter/Space where appropriate.</principle>
<principle id="announce-changes">Provide programmatic announcements for important state changes (sorting, filtering, error messages) using `aria-live` regions or visually-hidden text updated for screen readers.</principle>
</principles>

Process / Workflow (checklist)

- 1. Identify the primitive to build/refactor (e.g., `SortableHeader`, `DataTable`) and open the corresponding route or component using `~` imports.
- 2. Choose semantic elements first (e.g., `<table>` / `<thead>` / `<tbody>`, `<button>` for clickable headers).
- 3. Implement keyboard interactions: `tabIndex`, `onKeyDown` handling for `Enter`/` ` (Space), and ensure focus is visible via the repo `cn()`/styles.
- 4. Add ARIA attributes only as needed: `aria-sort`, `role="row"`, `aria-live` for announcements, `aria-describedby` for errors.
- 5. Wire announcements: update an `aria-live="polite"` region on sort/filter changes or important errors.
- 6. Write a minimal example (see `assets/`) and include `~` imports, `cn()` usage, and references to `components/ui/*`.
- 7. Validate with the checklist below, run a quick keyboard walkthrough, and add a unit or storybook example demonstrating keyboard and screen-reader behavior.

Validation checklist

**Currently Implemented (Required):**

- Frontend patterns: Uses `~` imports for internal modules and references `components/ui/*` where applicable.
- Styling helper: Uses `cn()` utility for conditional classnames on interactive elements.
- Semantic markup: Table headers/cells and button elements are used appropriately.
- Keyboard: Tab order, `tabIndex`, `onKeyDown` for Enter/Space implemented and tested.
- Focus management: Focus moved to new content when necessary and focus outlines visible.

**Recommended Enhancements (Future / Aspirational):**

- ARIA: `aria-sort`, `role` attributes on sortable headers.
- Messaging: Errors and important state changes announced via `aria-describedby` or `aria-live` regions.
- Live regions: Update an `aria-live="polite"` region when sort order changes or filters are applied.

Connected Skills

- `tsh-creating-frontend-tables` — for table/list patterns and URL param state patterns used by `useTable`.
- `creating-forms` — when primitives include form controls that need schema validation and accessible labels.

References

- Examples: `./assets/sortable-header.a11y.example.tsx`, `./assets/data-table.a11y.example.tsx`
- Quick guidelines: `./references/accessibility-guidelines.md`

Repository specifics

- Use `~` imports for local modules (e.g., `import { cn } from '~/lib/utils'`).
- Prefer shadcn UI primitives from `~/components/ui` (Button, Table, Input, Label, etc.) for visual building blocks.
- Treat `SortableHeader` and `DataTable` as canonical components and keep examples consistent with their public prop shapes.
