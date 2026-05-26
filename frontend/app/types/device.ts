import z from "zod";
import { createPaginatedResponseSchema } from "~/types/api";
import { BaseTableParamsSchema } from "~/types/table";

export const DeviceTypeSchema = z.object({
  deviceTypeName: z.string(),
  id: z.number(),
});

export type DeviceType = z.infer<typeof DeviceTypeSchema>;

export const DeviceSchema = z.object({
  id: z.coerce.number(),
  deviceName: z.string().trim().min(1, "Nazwa jest wymagana").max(100),
  deviceType: DeviceTypeSchema,
});

export type Device = z.infer<typeof DeviceSchema>;

export const CreateDeviceSchema = DeviceSchema.omit({
  id: true,
  deviceType: true,
}).extend({
  deviceTypeId: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Wybierz typ urządzenia",
    }),
});

export const UpdateDeviceSchema = DeviceSchema.omit({
  deviceType: true,
}).extend({
  deviceTypeId: z.coerce.number(),
});

export type CreateDeviceFormInput = z.input<typeof CreateDeviceSchema>;
export type CreateDeviceFormData = z.output<typeof CreateDeviceSchema>;

export type UpdateDeviceFormData = z.infer<typeof UpdateDeviceSchema>;

export const DeviceFilterSchema = BaseTableParamsSchema;

export type DeviceFilterParams = z.infer<typeof DeviceFilterSchema>;

export const DeviceResponseSchema = createPaginatedResponseSchema(DeviceSchema);

export const DeviceTypeResponseSchema =
  createPaginatedResponseSchema(DeviceTypeSchema);

export type DeviceTypeResponse = z.infer<typeof DeviceTypeResponseSchema>;

export type DeviceResponse = z.infer<typeof DeviceResponseSchema>;

export const DeviceDbResponseSchema =
  createPaginatedResponseSchema(DeviceSchema);

export type DeviceDbResponse = z.infer<typeof DeviceDbResponseSchema>;

export const DeviceResponseFromDbSchema = DeviceDbResponseSchema.transform(
  (result) => ({
    data: result.data.map((device) => DeviceSchema.parse(device)),
    meta: result.meta,
  }),
);
