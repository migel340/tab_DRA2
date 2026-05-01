import { MOCK_PERSONEL_LIST } from "~/mocks/personel";
import type { PersonelDB } from "~/types/personel";

let DB = [...MOCK_PERSONEL_LIST] as PersonelDB[];
let nextId = 5;

export const personelApi = {
  getOne: async (id: number) => DB.find((p) => p.id === id),

  getAll: async () => DB,

  create: async (payload: Omit<PersonelDB, "id">) => {
    const newUser = { ...payload, id: nextId++ };
    DB.push(newUser);
    return newUser;
  },

  update: async (id: number, payload: Partial<PersonelDB>) => {
    const index = DB.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Not found");
    DB[index] = { ...DB[index], ...payload };
    return DB[index];
  },
};
