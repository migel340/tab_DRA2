import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router";
import Section from "~/components/Section";
import InputField from "~/components/InputField";
import { Button } from "~/components/ui/button";
import { FieldSet } from "~/components/ui/field";
import { DeviceTypeSelect } from "~/components/Select";
import {
  CreateDeviceSchema,
  type CreateDeviceFormData,
  type CreateDeviceFormInput,
  type Device,
  type DeviceType,
} from "~/types/device";

interface DeviceFormProps {
  initialValues?: Device;
  isEdit?: boolean;
  onSubmit: (data: CreateDeviceFormData) => void;
  deviceTypes: DeviceType[];
}

export default function DeviceForm({
  initialValues,
  isEdit = false,
  onSubmit,
  deviceTypes,
}: DeviceFormProps) {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<CreateDeviceFormInput, any, CreateDeviceFormData>({
    resolver: zodResolver(CreateDeviceSchema),
    defaultValues: {
      deviceName: initialValues?.deviceName ?? "",
      deviceTypeId: initialValues?.deviceType?.id ?? undefined,
    },
    reValidateMode: "onBlur",
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Section headerName="Informacje" className="flex flex-col gap-5">
        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="deviceName"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Nazwa"
                field={field}
                fieldState={fieldState}
                placeholder="Nazwa"
              />
            )}
          />

          <Controller
            name="deviceTypeId"
            control={control}
            render={({ field, fieldState }) => (
              <DeviceTypeSelect
                field={field}
                fieldState={fieldState}
                options={deviceTypes}
              />
            )}
          />
        </FieldSet>
      </Section>

      <FieldSet className="flex flex-row items-center gap-3">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isEdit ? "Zapisz" : "Stwórz"}
        </Button>
        <Button
          variant="secondary"
          type="button"
          size="lg"
          disabled={isSubmitting}
          onClick={() => navigate(-1)}
        >
          Anuluj
        </Button>
      </FieldSet>
    </Form>
  );
}
