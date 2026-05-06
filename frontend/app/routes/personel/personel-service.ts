import { personelApi } from "./personel-api";
import { PersonelSchema, PersonelListSchema } from "~/types/personel";
import type {
  Personel,
  PersonelCreatePayload,
  PersonelUpdatePayload,
} from "~/types/personel";
import type { PersonelFilterParams } from "./schema";

export const personelService = {
  getPersonelById: async (
    request: Request,
    id: number,
  ): Promise<Personel | undefined> => {
    const raw = await personelApi.getOne(request, id);
    if (!raw) return undefined;

    return PersonelSchema.parse(raw);
  },

  fetchPersonelList: async (
    request: Request,
    params: PersonelFilterParams,
  ): Promise<Personel[]> => {
    const result = await personelApi.getAll(params, request);

    return PersonelListSchema.parse(result.data);
  },

  createPersonel: async (
    data: PersonelCreatePayload,
    request: Request,
  ): Promise<Personel> => {
    const createdRaw = await personelApi.create(data, request);
    return PersonelSchema.parse(createdRaw);
  },

  updatePersonel: async (
    id: number,
    data: PersonelUpdatePayload,
    request: Request,
  ): Promise<Personel> => {
    const { id: _id, ...dbPayload } = data;

    const updatedRaw = await personelApi.update(id, dbPayload, request);
    return PersonelSchema.parse(updatedRaw);
  },

  deletePersonel: async (id: number, request: Request): Promise<void> => {
    await personelApi.delete(id, request);
  },
};
