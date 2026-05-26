import type { DeviceDB } from "~/types/device";

export const MOCK_DEVICES: DeviceDB[] = [
  { id: 1, name: "MacBook Pro 14", type: "LAPTOP", client_id: 1 },
  { id: 2, name: "iPhone 14", type: "SMARTPHONE", client_id: 1 },
  { id: 3, name: "iPad Air", type: "TABLET", client_id: 1 },
  { id: 4, name: "Dell Inspiron", type: "LAPTOP", client_id: 2 },
  { id: 5, name: "Samsung Galaxy S23", type: "SMARTPHONE", client_id: 3 },
  { id: 6, name: "HP LaserJet", type: "PRINTER", client_id: 3 },
  { id: 7, name: "Lenovo ThinkPad", type: "PC", client_id: 4 },
  { id: 8, name: 'Sony Bravia 55"', type: "TV", client_id: 4 },
];

export function filterMockDevices(
  clientId: number,
  query?: string,
  limit = 10,
  offset = 0,
) {
  let filtered = MOCK_DEVICES.filter((d) => d.client_id === clientId);

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter((d) => d.name.toLowerCase().includes(q));
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
