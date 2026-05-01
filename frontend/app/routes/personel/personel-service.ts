import { personelApi } from "./personel-api";
import { PersonelSchema, PersonelListSchema } from "~/types/personel";
import type {
  Personel,
  PersonelCreatePayload,
  PersonelUpdatePayload,
} from "~/types/personel";
import type { FilterValues } from "./schema";

export const personelService = {
  getPersonelById: async (id: number): Promise<Personel | undefined> => {
    const raw = await personelApi.getOne(id);
    if (!raw) return undefined;

    return PersonelSchema.parse(raw);
  },

  fetchPersonelList: async (filters: FilterValues): Promise<Personel[]> => {
    const rawList = await personelApi.getAll();

    return PersonelListSchema.parse(rawList);
  },

  createPersonel: async (data: PersonelCreatePayload): Promise<Personel> => {
    const { password, ...dbPayload } = data;

    const createdRaw = await personelApi.create(dbPayload);
    return PersonelSchema.parse(createdRaw);
  },

  updatePersonel: async (
    id: number,
    data: PersonelUpdatePayload,
  ): Promise<Personel> => {
    const { id: _id, password, ...dbPayload } = data;

    const updatedRaw = await personelApi.update(id, dbPayload);
    return PersonelSchema.parse(updatedRaw);
  },
};
