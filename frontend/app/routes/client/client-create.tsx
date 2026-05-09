import PageLayout from "~/layouts/PageLayout";
import ClientForm, { type ClientFormValues } from "./client-form";
import {
  buildClientFormValuesFromFormData,
  flattenClientFormValues,
} from "./client-form";
import { useEffect } from "react";
import { useNavigate, useSubmit } from "react-router";
import type { Route } from "./+types/client-create";
import z from "zod";
import { clientService } from "./client-service";
import { ClientCreateApiSchema } from "~/types/client";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "nowy",
};

export async function loader({ request }: Route.LoaderArgs) {
  await requireManager(request);

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  await requireManager(request);

  const formData = await request.formData();
  const object = buildClientFormValuesFromFormData(formData);

  const result = ClientCreateApiSchema.safeParse(object);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      status: 400,
    };
  }

  const createdClient = await clientService.createClient(result.data, request);

  return {
    success: true,
    id: createdClient.id,
  };
}

export default function ClientCreatePage({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();

  useActionToast(actionData, "Pomyślnie utworzono klienta!");

  useEffect(() => {
    if (actionData?.success && actionData.id) {
      navigate(`/client/${actionData.id}`, { replace: true });
    }
  }, [actionData, navigate]);

  const onSubmit = (data: ClientFormValues) => {
    submit(flattenClientFormValues(data), {
      method: "POST",
    });
  };

  return (
    <PageLayout title="Dodaj nowego klienta">
      <ClientForm onSubmit={onSubmit} />
    </PageLayout>
  );
}
