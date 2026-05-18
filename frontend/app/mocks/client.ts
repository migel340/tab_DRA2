import type { ClientDetailDB } from "~/types/client";

export const MOCK_CLIENTS: ClientDetailDB[] = [
  {
    id: 1,
    surname: "Kowalski",
    firstName: "Jan",
    secondName: "Adam",
    phoneNumber: "123456789",
    birthDate: new Date("1985-03-15"),
    address: {
      city: "Warszawa",
      state: "Mazowieckie",
      postalCode: "00-001",
      country: "Polska",
    },
    addressId: 1,
    city: "Warszawa",
    state: "Mazowieckie",
    postal_code: "00-001",
    country: "Polska",
    deviceId: 0,
    device_count: 3,
  },
  {
    id: 2,
    surname: "Nowak",
    firstName: "Maria",
    secondName: undefined,
    phoneNumber: "987654321",
    birthDate: new Date("1990-07-22"),
    address: {
      city: "Krakow",
      state: "Malopolskie",
      postalCode: "30-001",
      country: "Polska",
    },
    addressId: 2,
    city: "Krakow",
    state: "Malopolskie",
    postal_code: "30-001",
    country: "Polska",
    deviceId: 0,
    device_count: 1,
  },
  {
    id: 3,
    surname: "Lewandowski",
    firstName: "Piotr",
    secondName: "Krzysztof",
    phoneNumber: "555666777",
    birthDate: new Date("1988-11-08"),
    address: {
      city: "Gdansk",
      state: "Pomorskie",
      postalCode: "80-001",
      country: "Polska",
    },
    addressId: 3,
    city: "Gdansk",
    state: "Pomorskie",
    postal_code: "80-001",
    country: "Polska",
    deviceId: 0,
    device_count: 2,
  },
  {
    id: 4,
    surname: "Wójcik",
    firstName: "Anna",
    secondName: undefined,
    phoneNumber: "111222333",
    birthDate: new Date("1992-05-30"),
    address: {
      city: "Wroclaw",
      state: "Dolnoslaskie",
      postalCode: "50-001",
      country: "Polska",
    },
    addressId: 4,
    city: "Wroclaw",
    state: "Dolnoslaskie",
    postal_code: "50-001",
    country: "Polska",
    deviceId: 0,
    device_count: 4,
  },
  {
    id: 5,
    surname: "Zieliński",
    firstName: "Tomasz",
    secondName: "Marek",
    phoneNumber: "444555666",
    birthDate: new Date("1987-09-12"),
    address: {
      city: "Poznan",
      state: "Wielkopolskie",
      postalCode: "60-001",
      country: "Polska",
    },
    addressId: 5,
    city: "Poznan",
    state: "Wielkopolskie",
    postal_code: "60-001",
    country: "Polska",
    deviceId: 0,
    device_count: 0,
  },
];

// Helper function to filter and paginate mock data
export function filterMockClients(
  query?: string,
  limit: number = 10,
  offset: number = 0,
) {
  let filtered = MOCK_CLIENTS;

  if (query) {
    const q = query.toLowerCase();
    filtered = MOCK_CLIENTS.filter((client) => {
      const fullName =
        `${client.firstName} ${client.secondName || ""} ${client.surname}`.toLowerCase();
      const phoneNumber = client.phoneNumber.toLowerCase();
      return fullName.includes(q) || phoneNumber.includes(q);
    });
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return {
    data: paginated,
    meta: {
      page: Math.floor(offset / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    },
  };
}
