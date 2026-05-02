Route module blueprint

File exports

- `export const handle = { ... }` // optional route handle
- `export async function loader({ request }) {}` // parse params, call services
- `export async function action({ request }) {}` // parse formData, call services
- `export default function Component()` // route UI component

Loader snippet

const parsed = MyFilterSchema.safeParse(params)
if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors }
const rows = await myService.getAll(parsed.data)
return { rows }

Action snippet

const form = await request.formData()
const payload = Object.fromEntries(form.entries())
const parsed = MyCreateSchema.safeParse(payload)
if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors }
const entity = await myService.create(parsed.data)
return { success: true, id: entity.id }

Client handling

- Read `actionData` after submit.
- If `actionData.success` show toast and navigate.
- If `actionData.fieldErrors` map into `setError` on the form.
