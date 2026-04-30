import { MOCK_PERSONEL_LIST } from "~/mocks/personel";
import type { Personel } from "~/types/personel";
import type { FilterValues } from "./schema";

export const personelService = {
  fetchPersonelList: async (params: FilterValues): Promise<Personel[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...MOCK_PERSONEL_LIST];
        resolve(filtered);
      }, 100);
    });
  },
};
