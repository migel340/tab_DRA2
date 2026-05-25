import PageLayout from "~/layouts/PageLayout";
import DeviceForm from "./device-form";
import { useEffect } from "react";
import { useNavigate, useSubmit } from "react-router";
import type { Route } from "./+types/device-create";
import z from "zod";
import { deviceService } from "./device-service";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";
import { CreateDeviceSchema, type CreateDeviceFormData } from "~/types/device";

export const handle = {
  breadcrumb: () => "nowe",
};

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireManager(request);

  const parsedClientId = z.coerce.number().safeParse(params.clientId);
  if (!parsedClientId.success) {
    throw new Response("Invalid client ID", { status: 400 });
  }

  const devicesTypes = await deviceService.getDevicesTypes(request);

  return { clientId: parsedClientId.data, devicesTypes };
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

  console.log(object);
  const result = CreateDeviceSchema.safeParse(object);

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
  const { clientId, devicesTypes } = loaderData;
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

  const onSubmit = (data: CreateDeviceFormData) => {
    submit(data, { method: "POST" });
  };

  return (
    <PageLayout title="Dodaj nowe urządzenie">
      <DeviceForm onSubmit={onSubmit} deviceTypes={devicesTypes} />
    </PageLayout>
  );
}
