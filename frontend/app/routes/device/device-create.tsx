import PageLayout from "~/layouts/PageLayout";
import DeviceForm, { type DeviceFormValues } from "./device-form";
import { useEffect } from "react";
import { useNavigate, useSubmit } from "react-router";
import type { Route } from "./+types/device-create";
import z from "zod";
import { deviceService } from "./device-service";
import { DeviceCreateApiSchema } from "~/types/device";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";

export const handle = {
  breadcrumb: () => "nowe",
};

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireManager(request);

  const parsedClientId = z.coerce.number().safeParse(params.clientId);
  if (!parsedClientId.success) {
    throw new Response("Invalid client ID", { status: 400 });
  }

  return { clientId: parsedClientId.data };
}

export async function action({ request, params }: Route.ActionArgs) {
  await requireManager(request);

  const parsedClientId = z.coerce.number().safeParse(params.clientId);
  if (!parsedClientId.success) {
    return {
      success: false,
      errors: { clientId: ["Nieprawidłowe ID klienta"] },
    };
  }

  const formData = await request.formData();
  const object = Object.fromEntries(formData.entries());

  const result = DeviceCreateApiSchema.safeParse(object);

  if (!result.success) {
    return {
      success: false,
      errors: z.flattenError(result.error).fieldErrors,
      status: 400,
    };
  }

  const created = await deviceService.createDevice(
    parsedClientId.data,
    result.data,
    request,
  );

  return { success: true, id: created.id };
}

export default function DeviceCreatePage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { clientId } = loaderData;
  const navigate = useNavigate();
  const submit = useSubmit();

  useActionToast(actionData, "Pomyślnie dodano urządzenie!");

  useEffect(() => {
    if (actionData?.success && actionData.id) {
      navigate(`/client/${clientId}/devices/${actionData.id}`, {
        replace: true,
      });
    }
  }, [actionData, navigate, clientId]);

  const onSubmit = (data: DeviceFormValues) => {
    submit(data as Record<string, string>, { method: "POST" });
  };

  return (
    <PageLayout title="Dodaj nowe urządzenie">
      <DeviceForm onSubmit={onSubmit} />
    </PageLayout>
  );
}
