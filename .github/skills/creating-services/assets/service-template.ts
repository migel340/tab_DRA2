import { z } from "zod";
// ~ import of api module and schemas
import * as personelApi from "~/routes/personel/personel-api";
import { PersonelSchema, PersonelListSchema } from "~/routes/personel/schema";

export type Personel = z.infer<typeof PersonelSchema>;

export async function getAll(): Promise<Personel[]> {
  const raw = await personelApi.fetchAll();
  const parsed = PersonelListSchema.parse(raw);
  return parsed.map((item) => ({
    id: item.id,
    name: item.name,
    role: item.role,
  }));
}

export async function getById(id: string): Promise<Personel> {
  const raw = await personelApi.fetchById(id);
  const parsed = PersonelSchema.parse(raw);
  return parsed;
}

export async function create(payload: unknown): Promise<Personel> {
  const raw = await personelApi.create(payload);
  const parsed = PersonelSchema.parse(raw);
  return parsed;
}
