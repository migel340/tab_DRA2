import { api } from "~/lib/api.server";
import type { PersonelDB } from "~/types/personel";
import type { PersonelFilterParams } from "./schema";

const ENDPOINT = "/personels";

export const personelApi = {
  getOne: async (request: Request, id: number) => {
    return api<PersonelDB>(
      ENDPOINT + `/${id}`,
      {
        method: "GET",
      },
      request,
    );
  },

  getAll: async (params: PersonelFilterParams, request: Request) =>
    api<{ data: PersonelDB[]; meta: Object }>(
      ENDPOINT,
      {
        method: "GET",
        params: params,
      },
      request,
    ),

  create: async (payload: Omit<PersonelDB, "id">, request: Request) =>
    api<PersonelDB>(
      ENDPOINT,
      { method: "POST", body: JSON.stringify(payload) },
      request,
    ),

  update: async (id: number, payload: Partial<PersonelDB>, request: Request) =>
    api<PersonelDB>(
      ENDPOINT + `/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
      request,
    ),

  delete: async (id: number, request: Request) =>
    api<void>(
      ENDPOINT + `/${id}`,
      {
        method: "DELETE",
      },
      request,
    ),
};
