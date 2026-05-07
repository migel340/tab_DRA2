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
    manager: "Jan Kowalski",
    description: "Naprawa matrycy komputera. fsfasdfsafsdfafsdfsa....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "Aktywne",
  },
  {
    id: "2024-02",
    date: "23/04/18",
    manager: "Jan Kowalski",
    description: "Czyszczenie układu chłodzenia....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "Aktywne",
  },
  {
    id: "2024-03",
    date: "23/04/18",
    manager: "Jan Kowalski",
    description: "Wymiana baterii w laptopie....",
    client: "Jan Kowalski",
    device: "mac m1",
    progress: 50,
    status: "Aktywne",
  },
];

export const requestsService = {
  fetchRequestsList: async (params: RequestsFilterParams) => {
    // Docelowo: wywołanie do API uwzględniające params
    // Walidacja struktury odpowiedzi z API za pomocą stworzonego schematu Zod
    return z.array(RequestItemSchema).parse(MOCK_REQUESTS);
  },
};