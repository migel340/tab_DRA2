import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/device-edit";
import z from "zod";
import { deviceService } from "./device-service";
import DeviceForm from "./device-form";
import { useSubmit } from "react-router";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";
import { UpdateDeviceSchema, type CreateDeviceFormData } from "~/types/device";

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

  const devicesTypes = await deviceService.getDevicesTypes(request);

  return { device, devicesTypes };
}

export async function action({ request, params }: Route.ActionArgs) {
  await requireManager(request);

  const parsedId = z.coerce.number().safeParse(params.deviceId);
  if (!parsedId.success) {
    return { message: "Invalid ID", status: 400 };
  }

  const formData = await request.formData();

  const object = Object.fromEntries(formData.entries());

  const parseResult = UpdateDeviceSchema.safeParse({
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
  const { device, devicesTypes } = loaderData;
  const submit = useSubmit();

  useActionToast(actionData);

  const onSubmit = (data: CreateDeviceFormData) => {
    submit(data, { method: "POST" });
  };

  return (
    <PageLayout title="Edycja urządzenia">
      <DeviceForm
        onSubmit={onSubmit}
        initialValues={device}
        deviceTypes={devicesTypes}
      />
    </PageLayout>
  );
}
