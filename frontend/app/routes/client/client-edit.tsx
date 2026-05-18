import PageLayout from "~/layouts/PageLayout";
import type { Route } from "./+types/client-edit";
import z from "zod";
import { clientService } from "./client-service";
import ClientForm, { type ClientFormValues } from "./client-form";
import {
  buildClientFormValuesFromFormData,
  flattenClientFormValues,
} from "./client-form";
import { useMemo } from "react";
import { useNavigate, useSubmit } from "react-router";
import {
  ClientUpdateApiSchema,
  type ClientUpdateFormData,
} from "~/types/client";
import { useActionToast } from "~/hooks/useActionToast";
import { requireManager } from "~/lib/auth.server";
import { deviceService } from "~/routes/device/device-service";
import { DeviceFilterSchema } from "~/types/device";
import { DataTable } from "~/components/DataTable";
import { columns } from "~/routes/device/columns";
import { useTable } from "~/hooks/useTable";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import Section from "~/components/Section";

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

  const url = new URL(request.url);
  const rawParams = Object.fromEntries(url.searchParams);
  const deviceParams = DeviceFilterSchema.parse(rawParams);

  const deviceList = await deviceService.fetchDeviceList(
    request,
    parsedId.data,
    deviceParams,
  );

  return { client, deviceList };
}

export async function action({ request, params }: Route.ActionArgs) {
  await requireManager(request);

  const { id } = params;
  const parsedId = z.coerce.number().safeParse(id);
  if (!parsedId.success) {
    return { message: "Invalid ID", status: 400 };
  }

  const formData = await request.formData();
  const object = buildClientFormValuesFromFormData(formData);

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
  const { client, deviceList } = loaderData;
  const submit = useSubmit();
  const navigate = useNavigate();

  useActionToast(actionData);

  const initialValues = useMemo<Omit<ClientUpdateFormData, "id">>(
    () => ({
      surname: client.surname,
      firstName: client.firstName,
      secondName: client.secondName ?? "",
      phoneNumber: client.phoneNumber,
      birthDate: client.birthDate?.toISOString().split("T")[0] ?? "",
      address: client.address ?? {
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
    }),
    [client],
  );

  const onSubmit = (data: ClientFormValues) => {
    submit(flattenClientFormValues(data), { method: "POST" });
  };

  const { table } = useTable({
    data: deviceList.data,
    columns,
    params: deviceList.meta,
    pageCount: deviceList.meta.totalPages,
  });

  return (
    <PageLayout title="Edycja klienta">
      <div className="flex flex-col gap-5">
        <ClientForm
          onSubmit={onSubmit}
          initialValues={initialValues}
          isEdit={true}
        />

        <Section headerName="Urządzenia">
          <div className="flex justify-end mb-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/client/${client.id}/devices/create`)}
            >
              <Plus />
              Dodaj urządzenie
            </Button>
          </div>
          <DataTable
            table={table}
            onRowClick={(id) => navigate(`/client/${client.id}/devices/${id}`)}
          />
        </Section>
      </div>
    </PageLayout>
  );
}
