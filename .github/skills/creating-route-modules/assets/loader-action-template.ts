import { redirect } from "react-router-dom";
import { z } from "zod";

// ~ imports to repo examples
import { PersonelFilterSchema } from "~/routes/personel/schema";
import { PersonelCreateApiSchema } from "~/routes/personel/schema";
import * as personelService from "~/routes/personel/personel-service";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const parsed = PersonelFilterSchema.safeParse(params);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = await personelService.getAll(parsed.data);
  return { data };
}

export async function action({ request }: { request: Request }) {
  const form = await request.formData();
  const payload = Object.fromEntries(form.entries());
  const parsed = PersonelCreateApiSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const created = await personelService.create(parsed.data);
  // return payload pattern; allow caller to redirect
  return { success: true, id: created.id };
}
