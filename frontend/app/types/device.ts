import z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";

export const DeviceTypeSchema = z.enum([
  "LAPTOP",
  "PC",
  "SMARTPHONE",
  "TABLET",
  "TV",
  "PRINTER",
  "OTHER",
]);

export type DeviceType = z.infer<typeof DeviceTypeSchema>;

export const DEVICE_TYPE_LABELS: Record<DeviceType, string> = {
  LAPTOP: "Laptop",
  PC: "Komputer stacjonarny",
  SMARTPHONE: "Smartfon",
  TABLET: "Tablet",
  TV: "Telewizor",
  PRINTER: "Drukarka",
  OTHER: "Inne",
};

export const DeviceDbSchema = z.object({
  id: z.number(),
  name: z.string().trim().min(1, "Nazwa jest wymagana").max(100),
  type: DeviceTypeSchema,
  client_id: z.number(),
});

export type DeviceDB = z.infer<typeof DeviceDbSchema>;

const baseDeviceFields = z.object({
  name: z.string().trim().min(1, "Nazwa jest wymagana").max(100),
  type: DeviceTypeSchema,
});

export const DeviceCreateFormSchema = baseDeviceFields;

export const DeviceUpdateFormSchema = baseDeviceFields.extend({
  id: z.coerce.number(),
});

export const DeviceCreateApiSchema = DeviceCreateFormSchema;

export const DeviceUpdateApiSchema = DeviceUpdateFormSchema;

export type DeviceCreateFormData = z.infer<typeof DeviceCreateFormSchema>;
export type DeviceUpdateFormData = z.infer<typeof DeviceUpdateFormSchema>;

export type DeviceCreatePayload = z.output<typeof DeviceCreateApiSchema>;
export type DeviceUpdatePayload = z.output<typeof DeviceUpdateApiSchema>;

export const DeviceSchema = DeviceDbSchema.transform((data) => ({
  id: data.id,
  name: data.name,
  type: data.type,
  clientId: data.client_id,
}));

export type Device = z.output<typeof DeviceSchema>;

export const DeviceFilterSchema = BaseTableParamsSchema;

export type DeviceFilterParams = z.infer<typeof DeviceFilterSchema>;

export const DeviceResponseSchema = createPaginatedResponseSchema(DeviceSchema);

export type DeviceResponse = z.infer<typeof DeviceResponseSchema>;

export const DeviceDbResponseSchema =
  createPaginatedResponseSchema(DeviceDbSchema);

export type DeviceDbResponse = z.infer<typeof DeviceDbResponseSchema>;

export const DeviceResponseFromDbSchema = DeviceDbResponseSchema.transform(
  (result) => ({
    data: result.data.map((device) => DeviceSchema.parse(device)),
    meta: result.meta,
  }),
);
