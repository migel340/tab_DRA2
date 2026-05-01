import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router";
import Section from "~/components/Section";
import InputField from "~/components/InputField";
import { Button } from "~/components/ui/button";
import {
  PersonelCreateFormSchema,
  PersonelUpdateFormSchema,
  type PersonelCreateFormData,
  type PersonelUpdateFormData,
} from "~/types/personel";
import { AccountStatusSelect, PersonelRoleSelect } from "~/components/Select";

export type PersonelFormValues =
  | PersonelCreateFormData
  | Omit<PersonelUpdateFormData, "id">;

interface PersonelFormProps {
  initialValues?: Omit<PersonelUpdateFormData, "id">;
  isEdit?: boolean;
  onSubmit: (data: PersonelFormValues) => void;
}

export default function PersonelForm({
  initialValues,
  isEdit = false,
  onSubmit,
}: PersonelFormProps) {
  const navigate = useNavigate();

  const schema = isEdit
    ? PersonelUpdateFormSchema.omit({ id: true })
    : PersonelCreateFormSchema;

  const { handleSubmit, control } = useForm<PersonelFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues || {
      firstName: "",
      surname: "",
      username: "",
      password: "",
      role: "WORKER",
      status: "ACTIVE",
    },
    reValidateMode: "onBlur",
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Section headerName={"Informacje"} className="flex flex-col gap-5">
        <div className="flex flex-col md:flex-row gap-5">
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
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <Controller
            name="username"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label="Login"
                field={field}
                fieldState={fieldState}
                placeholder="jkowalski"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <InputField
                label={isEdit ? "Nowe hasło (opcjonalnie)" : "Hasło"}
                field={field}
                fieldState={fieldState}
                placeholder={isEdit ? "••••••••" : "Wpisz hasło"}
              />
            )}
          />
        </div>

        <div className="flex w-fit items-center flex-row md:flex-row gap-5 ">
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <PersonelRoleSelect
                label="Rola"
                field={field}
                fieldState={fieldState}
                placeholder="Wybierz rolę"
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field, fieldState }) => (
              <AccountStatusSelect
                field={field}
                fieldState={fieldState}
                label="Status konta"
                showAllOption={false}
              />
            )}
          />
        </div>
      </Section>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg">
          {isEdit ? "Zapisz" : "Stwórz"}
        </Button>
        <Button
          variant="secondary"
          type="button"
          size="lg"
          onClick={() => navigate(-1)}
        >
          Anuluj
        </Button>
      </div>
    </Form>
  );
}
