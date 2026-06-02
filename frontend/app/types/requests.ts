import z from "zod";
import {DeviceSchema} from "~/types/device";
import {PersonelDbSchema} from "~/types/personel";

export const RequestDbSchema = z.object({
  id: z.number(),
  device: DeviceSchema.optional().nullable(),
  manager: PersonelDbSchema.optional().nullable(),
  description: z.string().trim().min(1, "Nazwa użytkownika jest wymagana"),
  status: z.string().trim().min(1, "Status jest wymagany"),
  dateRegistered: z.string().optional().nullable(),
  dateFinishedCancelled: z.string().optional().nullable(),
});

export type RequestDB = z.infer<typeof RequestDbSchema>;

const baseRequestFields = RequestDbSchema.omit({
  id: true,
});

export const RequestCreateFormSchema = baseRequestFields;

export const RequestUpdateFormSchema = baseRequestFields.extend({
  id: z.coerce.number(),
});

export const RequestCreateApiSchema = RequestCreateFormSchema.transform(
  (data) => {
   const { ...rest } = data;
    return {
      ...rest,
    };
  },
);

export const RequestUpdateApiSchema = RequestUpdateFormSchema.transform(
  (data) => {
    const { ...rest } = data;
    return {
      ...rest,
    };
  },
);

export type RequestCreateFormData = z.input<typeof RequestCreateApiSchema>;
export type RequestUpdateFormData = z.input<typeof RequestUpdateApiSchema>;

// export type RequestFormInput = RequestCreateFormData | RequestUpdateFormData;
export type RequestCreatePayload = z.output<typeof RequestCreateApiSchema>;
export type RequestUpdatePayload = z.output<typeof RequestUpdateApiSchema>;

export const RequestSchema = RequestDbSchema.transform((data) => {
  const { ...rest } = data;
  return {
    ...rest,
  };
});

// export type Request = z.output<typeof RequestSchema>;

// export const RequestListSchema = z.array(RequestSchema);

// export const RequestDetailSchema = RequestSchema;