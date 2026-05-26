export const MOCK_CLIENTS = [
  { id: "1", name: "Jan Kowalski" },
  { id: "2", name: "Firma XYZ" },
];

export const MOCK_DEVICES = [
  { id: "101", name: "Dell XPS 15" },
  { id: "102", name: "MacBook Air M1" },
];

export const MOCK_STATUSES = [
  { id: "OPN", name: "OPEN" },
  { id: "PRO", name: "PROGRESS" },
  { id: "FIN", name: "FINISH" },
  { id: "CAN", name: "CANCELED" },
];

export const MOCK_ACTIVITIES = [
  { id: 1, type: "Diagnoza", desc: "Sprawdzenie układu zasilania", executor: "Piotr Wiśniewski", status: "Aktywne", created: "10-05-2024", finished: "-" },
  { id: 2, type: "Kontakt", desc: "Telefon do klienta z wyceną", executor: "Anna Nowak", status: "Zakończone", created: "11-05-2024", finished: "11-05-2024" },
];

export const MOCK_ACTIVITY_TYPES = [
  { id: "diagnoza", name: "Diagnoza" },
  { id: "kontakt", name: "Kontakt z klientem" },
  { id: "naprawa", name: "Naprawa sprzętu" },
];

export const MOCK_EXECUTORS = [
  { id: "1", name: "Piotr Wiśniewski" },
  { id: "2", name: "Anna Nowak" },
];