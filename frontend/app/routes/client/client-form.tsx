import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router";
import Section from "~/components/Section";
import InputField from "~/components/InputField";
import { Button } from "~/components/ui/button";
import { FieldSet } from "~/components/ui/field";
import {
  ClientCreateFormSchema,
  ClientUpdateFormSchema,
  type ClientCreateFormData,
  type ClientUpdateFormData,
} from "~/types/client";

export type ClientFormValues =
  | ClientCreateFormData
  | Omit<ClientUpdateFormData, "id">;

interface ClientFormProps {
  initialValues?: Omit<ClientUpdateFormData, "id">;
  isEdit?: boolean;
  onSubmit: (data: ClientFormValues) => void;
}

export default function ClientForm({
  initialValues,
  isEdit = false,
  onSubmit,
}: ClientFormProps) {
  const navigate = useNavigate();

  const schema = isEdit
    ? ClientUpdateFormSchema.omit({ id: true })
    : ClientCreateFormSchema;

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      idDevice: "",
      surname: "",
      firstName: "",
      secondName: "",
      tel: "",
      birthDate: "",
    },
    reValidateMode: "onBlur",
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Section
        headerName={"Informacje klienta"}
        className="flex flex-col gap-5"
      >
        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Imię"
                field={field}
                fieldState={fieldState}
                placeholder="Jan"
              />
            )}
          />

          <Controller
            name="surname"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Nazwisko"
                field={field}
                fieldState={fieldState}
                placeholder="Kowalski"
              />
            )}
          />
        </FieldSet>

        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="secondName"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Drugie imię"
                field={field}
                fieldState={fieldState}
                placeholder="Adam"
              />
            )}
          />

          <Controller
            name="tel"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Telefon"
                field={field}
                fieldState={fieldState}
                placeholder="123456789"
              />
            )}
          />
        </FieldSet>

        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="idDevice"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="ID urządzenia"
                field={field}
                fieldState={fieldState}
                type="number"
                min={1}
                placeholder="101"
              />
            )}
          />

          <Controller
            name="birthDate"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Data urodzenia"
                field={field}
                fieldState={fieldState}
                type="date"
              />
            )}
          />
        </FieldSet>
      </Section>

      <FieldSet className="flex items-center gap-3">
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
