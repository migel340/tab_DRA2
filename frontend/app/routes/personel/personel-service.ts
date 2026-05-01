import { MOCK_PERSONEL_LIST } from "~/mocks/personel";
import type {
  Personel,
  PersonelCreatePayload,
  PersonelUpdatePayload,
} from "~/types/personel";
import type { FilterValues } from "./schema";

const DATABSE = [...MOCK_PERSONEL_LIST];
let id = 5;
export const personelService = {
  getPersonelById: async (
    personelId: number,
  ): Promise<Personel | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = DATABSE.find(({ id }) => id === personelId);
        resolve(filtered);
      }, 100);
    });
  },
  fetchPersonelList: async (params: FilterValues): Promise<Personel[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...DATABSE];
        resolve(filtered);
      }, 100);
    });
  },

  createPersonel: async (data: PersonelCreatePayload): Promise<Personel> => {
    const { password, ...rest } = data;
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          ...rest,
          id: id++,
        };
        DATABSE.push(user);
        resolve(user);
      }, 100);
    });
  },

  updatePersonel: async (
    personelId: number,
    data: PersonelUpdatePayload,
  ): Promise<Personel> => {
    const { id: _id, password, ...rest } = data;
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = DATABSE.findIndex(({ id }) => id === personelId);
        if (index !== -1) {
          const updated = {
            ...DATABSE[index],
            ...rest,
          };
          DATABSE[index] = updated;
          resolve(updated);
        }
      }, 100);
    });
  },
};
