import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/personel-edit";
import z from "zod";
import { personelService } from "./personel-service";
import PersonelForm, { type PersonelFormValues } from "./personel-form";
import { useMemo } from "react";
import { useSubmit, redirect } from "react-router";
import {
  PersonelUpdateApiSchema,
  type PersonelUpdateFormData,
} from "~/types/personel";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

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
      errors: z.treeifyError(parseResult.error),
      status: 400,
    };
  }

  await personelService.updatePersonel(result.data, parseResult.data);

  throw redirect(`/personel/${result.data}`, {
    headers: { "X-Remix-Replace": "true" },
  });
}

export default function PersonelEditPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { personel } = loaderData;
  const submit = useSubmit();

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
      {actionData?.message && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircleIcon />
          <AlertTitle>Wystąpił Błąd</AlertTitle>
          <AlertDescription> {actionData.message}</AlertDescription>
        </Alert>
      )}
      <PersonelForm
        onSubmit={onSubmit}
        initialValues={initValues}
        isEdit={true}
      />
    </PageLayout>
  );
}
