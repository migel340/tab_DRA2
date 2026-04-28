import type { Role } from "~/types/auth";
import type { Personel } from "~/types/personel";

export const MOCK_PERSONEL_LIST: Personel[] = [
  {
    id: 1,
    firstName: "John",
    surname: "Doe",
    role: "MANAGER" as Role,
    username: "jdoe_mgr",
    active: true,
  },
  {
    id: 2,
    firstName: "Jane",
    surname: "Smith",
    role: "WORKER" as Role,
    username: "jsmith_wrk",
    active: true,
  },
  {
    id: 3,
    firstName: "Robert",
    surname: "Brown",
    role: "WORKER" as Role,
    username: "rbrown_wrk",
    active: false,
  },
  {
    id: 4,
    firstName: "Emily",
    surname: "Davis",
    role: "MANAGER" as Role,
    username: "edavis_mgr",
    active: true,
  },
  {
    id: 5,
    firstName: "Michael",
    surname: "Wilson",
    role: "WORKER" as Role,
    username: "mwilson_wrk",
    active: true,
  },
];
