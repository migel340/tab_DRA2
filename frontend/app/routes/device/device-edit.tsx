import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/device-edit";
import z from "zod";
import { deviceService } from "./device-service";
import DeviceForm, { type DeviceFormValues } from "./device-form";
import { useEffect, useMemo } from "react";
import { useNavigate, useSubmit } from "react-router";
import {
  DeviceUpdateApiSchema,
  type DeviceUpdateFormData,
} from "~/types/device";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";
import DeleteButton from "~/components/DeleteButton";

export const handle = {
  breadcrumb: () => "edycja",
};

export async function loader({ request, params }: Route.LoaderArgs) {
  await requireManager(request);

  const parsedId = z.coerce.number().safeParse(params.deviceId);
  if (!parsedId.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const device = await deviceService.getDeviceById(request, parsedId.data);
  if (!device) {
    throw new Response("Not found", { status: 404 });
  }

  return { device };
}

export async function action({ request, params }: Route.ActionArgs) {
  await requireManager(request);

  const parsedId = z.coerce.number().safeParse(params.deviceId);
  if (!parsedId.success) {
    return { message: "Invalid ID", status: 400 };
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deviceService.deleteDevice(parsedId.data, request);
    return { success: true, deleted: true };
  }

  const object = Object.fromEntries(formData.entries());
  const parseResult = DeviceUpdateApiSchema.safeParse({
    ...object,
    id: params.deviceId,
  });

  if (!parseResult.success) {
    return {
      errors: z.flattenError(parseResult.error).fieldErrors,
      status: 400,
    };
  }

  try {
    await deviceService.updateDevice(parsedId.data, parseResult.data, request);
    return { success: true };
  } catch {
    return { message: "Błąd serwera podczas aktualizacji", success: false };
  }
}

export default function DeviceEditPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { device } = loaderData;
  const submit = useSubmit();
  const navigate = useNavigate();

  useActionToast(actionData);

  useEffect(() => {
    if (actionData?.success && actionData.deleted) {
      navigate(`/client/${device.clientId}`, { replace: true });
    }
  }, [actionData, navigate, device.clientId]);

  const initialValues = useMemo<Omit<DeviceUpdateFormData, "id">>(
    () => ({
      name: device.name,
      type: device.type,
    }),
    [device],
  );

  const onSubmit = (data: DeviceFormValues) => {
    submit(data as Record<string, string>, { method: "POST" });
  };

  const onDelete = () => {
    const formData = new FormData();
    formData.append("intent", "delete");
    submit(formData, { method: "POST" });
  };

  return (
    <PageLayout
      title="Edycja urządzenia"
      actions={
        <DeleteButton
          onConfirm={onDelete}
          confirmTitle="Usuń urządzenie"
          confirmDescription="Czy na pewno chcesz usunąć to urządzenie? Operacja jest nieodwracalna."
        />
      }
    >
      <DeviceForm onSubmit={onSubmit} initialValues={initialValues} isEdit />
    </PageLayout>
  );
}
