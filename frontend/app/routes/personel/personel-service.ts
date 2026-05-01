import { MOCK_PERSONEL_LIST } from "~/mocks/personel";
import {
  PersonelSchema,
  type Personel,
  type PersonelDB,
  type PersonelCreatePayload,
  type PersonelUpdatePayload,
  PersonelListSchema,
} from "~/types/personel";
import type { FilterValues } from "./schema";

const DATABASE = [...MOCK_PERSONEL_LIST] as PersonelDB[];
let nextId = 5;

export const personelService = {
  getPersonelById: async (
    personelId: number,
  ): Promise<Personel | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const rawData = DATABASE.find(({ id }) => id === personelId);
        if (!rawData) return resolve(undefined);

        const validated = PersonelSchema.parse(rawData);
        resolve(validated);
      }, 100);
    });
  },

  fetchPersonelList: async (params: FilterValues): Promise<Personel[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...DATABASE];
        const personnelList = PersonelListSchema.parse(filtered);
        resolve(personnelList);
      }, 100);
    });
  },

  createPersonel: async (data: PersonelCreatePayload): Promise<Personel> => {
    const { password, ...rest } = data;

    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: PersonelDB = {
          ...rest,
          id: nextId++,
        };

        DATABASE.push(newUser);

        resolve(PersonelSchema.parse(newUser));
      }, 100);
    });
  },

  updatePersonel: async (
    personelId: number,
    data: PersonelUpdatePayload,
  ): Promise<Personel> => {
    const { id: _id, password, ...rest } = data;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = DATABASE.findIndex(({ id }) => id === personelId);

        if (index === -1) {
          return reject(new Error("Personel not found"));
        }

        const updatedRaw: PersonelDB = {
          ...DATABASE[index],
          ...rest,
        };

        DATABASE[index] = updatedRaw;

        resolve(PersonelSchema.parse(updatedRaw));
      }, 100);
    });
  },
};
