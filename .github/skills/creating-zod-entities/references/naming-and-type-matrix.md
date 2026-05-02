Naming and type extraction matrix

Map schema filenames/names to the recommended TypeScript extraction.

- EntityDbSchema -> `z.infer<typeof EntityDbSchema>` (backend DB shape)
- EntityCreateFormSchema -> `z.input<typeof EntityCreateApiSchema>` (form input)
- EntityUpdateFormSchema -> `z.input<typeof EntityUpdateApiSchema>` (form input)
- EntityCreateApiSchema -> `z.output<typeof EntityCreateApiSchema>` (payload sent to API)
- EntityUpdateApiSchema -> `z.output<typeof EntityUpdateApiSchema>` (payload sent to API)
- EntitySchema -> `z.output<typeof EntitySchema>` (canonical client/domain type)
- EntityListSchema -> `Array<z.output<typeof EntitySchema>>`
- EntityDetailSchema -> `z.output<typeof EntitySchema>`

Quick rule: use `z.input<>` for user-provided/form types and `z.output<>` for normalized server or domain outputs.

Example (personel):

- PersonelCreateFormData = z.input<typeof PersonelCreateApiSchema>
- PersonelCreatePayload = z.output<typeof PersonelCreateApiSchema>
- Personel = z.output<typeof PersonelSchema>

Mini example clarifying `z.input` / `z.output`:

```ts
// form schema describes what user submits
const CreateFormSchema = z.object({ name: z.string(), status: z.string() });

// api schema transforms form -> payload (maps status -> active)
const CreateApiSchema = CreateFormSchema.transform(
  (d: z.infer<typeof CreateFormSchema>) => ({
    name: d.name,
    active: d.status === "ACTIVE",
  }),
);

type CreateFormData = z.input<typeof CreateApiSchema>; // what the form supplies
type CreatePayload = z.output<typeof CreateApiSchema>; // what we send to API
```

Use `z.input` for values originating from users/forms and `z.output` for normalized values returned by transforms or APIs.

Note: When an API schema is built by transforming a form schema, `z.input<typeof EntityCreateApiSchema>` represents the pre-transform form shape because `z.input` describes the type accepted by the schema before `.transform()` runs. This lets you derive form input types from the transform-driven API schema. Alternatively, for readability you can use `z.infer<typeof EntityCreateFormSchema>` if a separate direct form schema exists.
