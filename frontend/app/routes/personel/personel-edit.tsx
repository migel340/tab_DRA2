import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/personel-edit";
import z from "zod";
import { personelService } from "./personel-service";
import PersonelForm, { type PersonelFormValues } from "./personel-form";
import { useMemo } from "react";
import { useSubmit } from "react-router";
import {
  PersonelUpdateApiSchema,
  type PersonelUpdateFormData,
} from "~/types/personel";
import { useActionToast } from "~/lib/hooks/useActionToast";

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  const result = z.coerce.number().safeParse(id);
  if (!result.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const numericId = result.data;

  const personel = await personelService.getPersonelById(numericId);
  if (personel === undefined) {
    throw new Response("NOT found", { status: 404 });
  }

  return { personel: personel };
}

export async function action({ request, params }: Route.ActionArgs) {
  const { id } = params;
  const result = z.coerce.number().safeParse(id);
  if (!result.success) {
    return { message: "Invalid ID", status: 400 };
  }

  const formData = await request.formData();
  const object = Object.fromEntries(formData.entries());

  const parseResult = PersonelUpdateApiSchema.safeParse({
    ...object,
    id,
  });

  if (!parseResult.success) {
    return {
      errors: z.flattenError(parseResult.error).fieldErrors,
      status: 400,
    };
  }

  try {
    await personelService.updatePersonel(result.data, parseResult.data);

    return { success: true };
  } catch (error) {
    return { message: "Błąd serwera podczas aktualizacji", success: false };
  }
}

export default function PersonelEditPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { personel } = loaderData;
  const submit = useSubmit();

  useActionToast(actionData);

  const initValues = useMemo<Omit<PersonelUpdateFormData, "id">>(
    () => ({
      firstName: personel.firstName,
      surname: personel.surname,
      username: personel.username,
      role: personel.role,
      status: personel.status,
    }),
    [personel],
  );

  const onSubmit = (data: PersonelFormValues) => {
    submit(data, {
      method: "POST",
    });
  };

  return (
    <PageLayout title="Edycja użytkownika">
      <PersonelForm
        onSubmit={onSubmit}
        initialValues={initValues}
        isEdit={true}
      />
    </PageLayout>
  );
}
