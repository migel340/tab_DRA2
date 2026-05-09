Validation timing

- Use client-side Zod validation on change or on blur for instant feedback.
- Keep expensive server validations in the action and map results back to fields.
- Prefer `onBlur` for fields with heavy UX (autocomplete) to reduce noise.

Error mapping

- Server errors should be returned as `{ fieldErrors: { name: ['msg'] }, formErrors: ['msg'] }`.
- Flatten nested Zod error maps to a single-level `fieldErrors` object before calling `setError`.
- Map only the first message per field into the form UI.

Accessibility checklist

- Every input has a visible label.
- Errors are announced and linked using `aria-describedby`.
- Focus moves to the first invalid input after submit.
- Buttons include explicit text; do not use icon-only buttons for submit.
