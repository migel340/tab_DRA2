Entity schema layering blueprint

This concise blueprint shows the canonical layers and short snippets to copy/adapt.

1. EntityDbSchema (backend shape)

Example:

```
export const EntityDbSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1),
  // other DB fields
  active: z.boolean(),
});
```

2. Form schemas (client input shapes)

```
const baseFields = EntityDbSchema.omit({ id: true, active: true });
export const EntityCreateFormSchema = baseFields.extend({
  status: AccountStatusSchema,
  password: passwordSchema,
});

export const EntityUpdateFormSchema = baseFields.extend({
  id: z.coerce.number(),
  status: AccountStatusSchema,
  password: passwordSchema.optional(),
});
```

3. API transform schemas (map form -> DB)

```
export const EntityCreateApiSchema = EntityCreateFormSchema.transform((data) => {
  const { status, ...rest } = data;
  return {
    ...rest,
    active: status === "ACTIVE",
  };
});
```

4. Canonical/client schema (DB -> domain)

```
export const EntitySchema = EntityDbSchema.transform((data) => {
  const { active, ...rest } = data;
  return { ...rest, status: (active ? "ACTIVE" : "INACTIVE") };
});
```

5. List/detail

```
export const EntityListSchema = z.array(EntitySchema);
export const EntityDetailSchema = EntitySchema;
```

Notes

- Prefer transforms over ad-hoc mappers in services. Transforms centralize shape logic and yield `z.input` / `z.output` types.
- Keep DB schema as the source of truth for server fields; build other layers from it.
