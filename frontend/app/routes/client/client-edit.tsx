import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/client-edit";
import z from "zod";
import { clientService } from "./client-service";
import ClientForm, { type ClientFormValues } from "./client-form";
import { useMemo } from "react";
import { useSubmit } from "react-router";
import {
  ClientUpdateApiSchema,
  type ClientUpdateFormData,
} from "~/types/client";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "edycja",
};

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireManager(request);

  const { id } = params;
  const parsedId = z.coerce.number().safeParse(id);
  if (!parsedId.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const client = await clientService.getClientById(request, parsedId.data);
  if (client === undefined) {
    throw new Response("Not found", { status: 404 });
  }

  return { client };
}

export async function action({ request, params }: Route.ActionArgs) {
  await requireManager(request);

  const { id } = params;
  const parsedId = z.coerce.number().safeParse(id);
  if (!parsedId.success) {
    return { message: "Invalid ID", status: 400 };
  }

  const formData = await request.formData();
  const object = Object.fromEntries(formData.entries());

  const parseResult = ClientUpdateApiSchema.safeParse({
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
    await clientService.updateClient(parsedId.data, parseResult.data, request);

    return { success: true };
  } catch {
    return { message: "Błąd serwera podczas aktualizacji", success: false };
  }
}

export default function ClientEditPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { client } = loaderData;
  const submit = useSubmit();

  useActionToast(actionData);

  const initialValues = useMemo<Omit<ClientUpdateFormData, "id">>(
    () => ({
      idDevice: String(client.idDevice),
      surname: client.surname,
      firstName: client.firstName,
      secondName: client.secondName ?? "",
      tel: client.tel,
      birthDate: client.birthDate.toISOString().split("T")[0],
    }),
    [client],
  );

  const onSubmit = (data: ClientFormValues) => {
    submit(data, {
      method: "POST",
    });
  };

  return (
    <PageLayout title="Edycja klienta">
      <ClientForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        isEdit={true}
      />
    </PageLayout>
  );
}
