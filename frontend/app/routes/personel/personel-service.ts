import { personelApi } from "./personel-api";
import { PersonelSchema } from "~/types/personel";
import type {
  Personel,
  PersonelCreatePayload,
  PersonelLookup,
  PersonelUpdatePayload,
} from "~/types/personel";
import {
  PersonelResponseSchema,
  type PersonelFilterParams,
  type PersonelResponse,
} from "./schema";
import type { UserRole } from "~/types/auth";

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
  ): Promise<PersonelResponse> => {
    const result = await personelApi.getAll(params, request);

    return PersonelResponseSchema.parse(result);
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
  fetchLookup: async (
    reuqets: Request,
    role: UserRole | null = null,
  ): Promise<PersonelLookup[]> => {
    return await personelApi.getPresonalLookup(role, reuqets);
  },
};
