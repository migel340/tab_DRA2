import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router";
import Section from "~/components/Section";
import InputField from "~/components/InputField";
import { Button } from "~/components/ui/button";
import { FieldSet } from "~/components/ui/field";
import { DeviceTypeSelect } from "~/components/Select";
import {
  DeviceCreateFormSchema,
  DeviceUpdateFormSchema,
  type DeviceCreateFormData,
  type DeviceUpdateFormData,
} from "~/types/device";

export type DeviceFormValues =
  | DeviceCreateFormData
  | Omit<DeviceUpdateFormData, "id">;

interface DeviceFormProps {
  initialValues?: Omit<DeviceUpdateFormData, "id">;
  isEdit?: boolean;
  onSubmit: (data: DeviceFormValues) => void;
}

const createSchema = DeviceCreateFormSchema;
const editSchema = DeviceUpdateFormSchema.omit({ id: true });

export default function DeviceForm({
  initialValues,
  isEdit = false,
  onSubmit,
}: DeviceFormProps) {
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<DeviceFormValues>({
    resolver: zodResolver(isEdit ? editSchema : createSchema),
    defaultValues: initialValues || {
      name: "",
      type: undefined,
    },
    reValidateMode: "onBlur",
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Section headerName="Informacje" className="flex flex-col gap-5">
        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="name"
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
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <DeviceTypeSelect field={field} fieldState={fieldState} />
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
