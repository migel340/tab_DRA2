import type { Personel } from "~/types/personel";

export const MOCK_PERSONEL_LIST: Personel[] = [
  {
    id: 1,
    firstName: "John",
    surname: "Doe",
    role: "MANAGER",
    username: "jdoe_mgr",
    active: true,
  },
  {
    id: 2,
    firstName: "Jane",
    surname: "Smith",
    role: "WORKER",
    username: "jsmith_wrk",
    active: true,
  },
  {
    id: 3,
    firstName: "Robert",
    surname: "Brown",
    role: "WORKER",
    username: "rbrown_wrk",
    active: false,
  },
  {
    id: 4,
    firstName: "Emily",
    surname: "Davis",
    role: "MANAGER",
    username: "edavis_mgr",
    active: true,
  },
  {
    id: 5,
    firstName: "Michael",
    surname: "Wilson",
    role: "WORKER",
    username: "mwilson_wrk",
    active: true,
  },
];
