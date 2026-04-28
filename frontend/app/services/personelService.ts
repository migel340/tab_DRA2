import { MOCK_PERSONEL_LIST } from "~/mocks/personel";
import type { Personel } from "~/types/personel";

export const personelService = {
  fetchPersonelList: async (): Promise<Personel[]> => {
    return new Promise((resolve) => resolve(MOCK_PERSONEL_LIST));
  },
};
