Validation boundaries and route/service guidance

Actions / Loaders (browser routes)

- Use `Schema.safeParse(input)` for incoming form or query data.
- On failure: return a structured error with flattened field errors so the UI can attach messages to fields.

Example:

```
const parsed = PersonelCreateFormSchema.safeParse(formData);
if (!parsed.success) {
  // use ZodError.flatten() to produce a shape the UI can consume
  const { fieldErrors, formErrors } = parsed.error.flatten();
  // return only fieldErrors for attaching to individual inputs
  return badRequest({ fieldErrors });
}
```

Expected `fieldErrors` shape:

```
{
  // keys are field paths, values are arrays of messages
  name: ["Name is required"],
  email: ["Invalid email format"],
}
```

Services (clients calling APIs / handling server responses)

- Use `Schema.parse(raw)` for server responses to fail-fast on unexpected shapes.
- Parse lists with `EntityListSchema.parse(rawList)` and single items with `EntitySchema.parse(raw)`.

Example (service):

```
const raw = await personelApi.getOne(id);
return PersonelSchema.parse(raw);
```

Coercion guidance

- When values arrive as strings (route params, query strings, form fields for numeric values) coerce with `z.coerce.number()` before `.min()`/.default assertions.
- For pagination and table params prefer `z.coerce.number()` for `page` and `limit`.

Error shaping

- Flatten Zod errors into a `fieldErrors` object keyed by field path for UI consumption.
- Avoid returning raw Zod error objects to the client.

Examples in repo

- `frontend/app/types/personel.ts` — layer pattern, transforms, and `z.coerce` usage.
- `frontend/app/types/status.ts` — enum reuse.
- `frontend/app/types/table.ts` — `z.coerce.number()` for paging params.
- `frontend/app/routes/personel/personel-service.ts` — services using `.parse()` on responses.
