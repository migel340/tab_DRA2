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

export function flattenClientFormValues(data: ClientFormValues) {
  return {
    ...data,
    "address.city": data.address.city,
    "address.state": data.address.state,
    "address.postalCode": data.address.postalCode,
    "address.country": data.address.country,
  };
}

export function buildClientFormValuesFromFormData(formData: FormData) {
  const object = Object.fromEntries(formData.entries());

  return {
    ...object,
    address: {
      city: String(object["address.city"] ?? ""),
      state: String(object["address.state"] ?? ""),
      postalCode: String(object["address.postalCode"] ?? ""),
      country: String(object["address.country"] ?? ""),
    },
  };
}

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
      surname: "",
      firstName: "",
      secondName: "",
      phoneNumber: "",
      birthDate: "",
      address: {
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
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
            name="phoneNumber"
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

          <div className="hidden md:block flex-1" />
        </FieldSet>
      </Section>

      <Section headerName={"Adres"} className="flex flex-col gap-5">
        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="address.city"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Miasto"
                field={field}
                fieldState={fieldState}
                placeholder="Warszawa"
                maxLength={20}
              />
            )}
          />

          <Controller
            name="address.state"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Województwo"
                field={field}
                fieldState={fieldState}
                placeholder="Mazowieckie"
                maxLength={20}
              />
            )}
          />
        </FieldSet>

        <FieldSet className="flex flex-col md:flex-row gap-5">
          <Controller
            name="address.postalCode"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Kod pocztowy"
                field={field}
                fieldState={fieldState}
                placeholder="00-001"
                maxLength={6}
              />
            )}
          />

          <Controller
            name="address.country"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Kraj"
                field={field}
                fieldState={fieldState}
                placeholder="Polska"
                maxLength={20}
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
