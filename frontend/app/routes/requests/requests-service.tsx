import { z } from "zod";
import type { RequestsFilterParams } from "./schema";

export const RequestItemSchema = z.object({
  id: z.string(),
  date: z.string(),
  manager: z.string(),
  description: z.string(),
  client: z.string(),
  device: z.string(),
  progress: z.number(),
  status: z.string(),
});

export type RequestItem = z.infer<typeof RequestItemSchema>;

const MOCK_REQUESTS: RequestItem[] = [
  {
    id: "2024-01",
    date: "23/04/18",
    manager: "admin",
    description: "Naprawa matrycy komputera. fsfasdfsafsdfafsdfsa....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "OPN",
  },
  {
    id: "2024-02",
    date: "23/04/13",
    manager: "Piotr Wiśniewski",
    description: "Czyszczenie układu chłodzenia....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "PRO",
  },
  {
    id: "2024-03",
    date: "23/04/18",
    manager: "admin",
    description: "Wymiana baterii w laptopie....",
    client: "Firma XYZ",
    device: "Dell XPS 15",
    progress: 100,
    status: "FIN",
  },
];

export const requestsService = {
  fetchRequestsList: async (params: RequestsFilterParams) => {
    let items = z.array(RequestItemSchema).parse(MOCK_REQUESTS);

    // Filtrowanie po Managerze
    if (params.manager && params.manager !== "all") {
      items = items.filter((req) => req.manager === params.manager);
    }

    // Filtrowanie po Statusie
    if (params.status && params.status !== "all") {
      items = items.filter((req) => req.status === params.status);
    }

    // Wyszukiwarka tekstowa (Opis, Klient, Manager, ID, Urządzenie)
    if (params.q && params.q !== "undefined") {
      const q = params.q.toLowerCase();
      items = items.filter((req) => 
        req.description.toLowerCase().includes(q) || 
        req.client.toLowerCase().includes(q) ||
        req.manager.toLowerCase().includes(q) ||
        req.id.toLowerCase().includes(q) ||
        req.device.toLowerCase().includes(q)
      );
    }

    return items;
  },
};