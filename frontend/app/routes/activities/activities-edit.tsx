import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  useNavigate,
  useSubmit,
  useActionData,
  useLoaderData,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import PageLayout from "~/layouts/PageLayout";
import { RepairStatusSelect } from "~/components/Select";
import {
  EditPersonelActivityFormSchema,
  type EditPersonelActivityFormData,
} from "./schema";
import { activitiesService } from "./activities-service";
import z from "zod";
import type { Route } from "./+types/activities-edit";
import { useActionToast } from "~/hooks/useActionToast";
import { requestsService } from "../requests/requests-service";
import { clientService } from "../client/client-service";
import { deviceService } from "../device/device-service";
import { userContext } from "~/context";

export async function loader({ params, request, context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const { id } = params;

  const result = z.coerce.number().safeParse(id);
  if (!result.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const activity = await activitiesService.getById(result.data, request);

  const _request = await requestsService.getRequestById(
    request,
    activity.requestId,
  );

  const device = await deviceService.getDeviceById(
    request,
    _request?.deviceId as number,
  );

  const client = await clientService.getClientById(
    request,
    device?.clientId as number,
  );

  return { activity, request: _request, device, client, user };
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const user = context.get(userContext);
  const { id } = params;

  const paresdId = z.coerce.number().safeParse(id);
  if (!paresdId.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const activity = await activitiesService.getById(paresdId.data, request);

  const canEdit = user.role !== "STAFF" || activity.executor?.id === user.id;
  if (!canEdit) {
    throw new Response("Forbidden", { status: 403 });
  }

  const payload = await request.json();
  const parsed = EditPersonelActivityFormSchema.safeParse(payload);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  await activitiesService.updateFromStaff(paresdId.data, parsed.data, request);

  return {
    success: true,
  };
}

export const handle = {
  breadcrumb: () => "szczegóły",
};

export default function PersonelActivityEditPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const { activity, request, client, device, user } = useLoaderData<typeof loader>();

  useActionToast(actionData, "Pomyślnie zaktualizowana aktwność!");

  const canEdit = user.role !== "STAFF" || activity.executor?.id === user.id;

  const { handleSubmit, control } = useForm<EditPersonelActivityFormData>({
    resolver: zodResolver(EditPersonelActivityFormSchema),
    defaultValues: {
      status: activity.status,
      result: activity.result ?? "",
    },
  });

  const translateStatus = (status: string | undefined) => {
    switch (status) {
      case "REGISTERED":
        return "Zarejestrowane";
      case "IN_PROGRESS":
        return "W trakcie";
      case "DONE":
        return "Zakończone";
      case "CANCELLED":
        return "Anulowane";
      default:
        return status || "Brak statusu";
    }
  };

  const onSubmit = (data: EditPersonelActivityFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Edytuj aktywność">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">
            Zgłoszenie
          </h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* Rząd 1: Grid 3 kolumny */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Klient */}
              <div className="flex flex-col gap-2">
                <Label>Klient</Label>
                <Input
                  disabled
                  value={`${client?.firstName + " " + client?.surname}`}
                  className="bg-gray-100 text-gray-500 font-medium"
                />
              </div>

              {/* Urządzenie */}
              <div className="flex flex-col gap-2">
                <Label>Urządzenie</Label>
                <Input
                  disabled
                  value={`${device?.deviceName}`}
                  className="bg-gray-100 text-gray-500 font-medium"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  disabled
                  value={translateStatus(request?.status)}
                  className="bg-gray-100 text-gray-500 font-medium"
                />
              </div>
            </div>

            {/* Rząd 2 i 3: Opis i Rezultat */}
            <div className="flex flex-col gap-2">
              <Label>Opis</Label>
              <Textarea
                id="description"
                disabled
                value={request?.description}
                className="bg-gray-100 text-gray-500 min-h-[100px]"
              />
            </div>
            {/* Przyciski Akcji Formularza */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-800"
                onClick={() =>
                  navigate(`/activities/request-details/${request?.id}`)
                }
              >
                Zobacz
              </Button>
            </div>
          </div>
        </div>
        {/* Informacje o aktywności */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* Górny wiersz (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Numer Sekwencji</Label>
                <Input
                  disabled
                  value={`${activity.id}`}
                  className="bg-gray-100 text-gray-500 font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Utworzono</Label>
                <Input
                  disabled
                  value={new Date(activity.dateRegistration).toLocaleDateString(
                    "pl-PL",
                  )}
                  className="bg-gray-100 text-gray-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Zakończono</Label>
                <Input
                  disabled
                  value={
                    activity.dateFinishedCancelled
                      ? new Date(
                          activity.dateFinishedCancelled,
                        ).toLocaleDateString("pl-PL")
                      : "-"
                  }
                  className="bg-gray-100 text-gray-500"
                />
              </div>
            </div>

            {/* Środkowy wiersz z Selectami (3 kolumny) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Typ</Label>
                <Input
                  disabled
                  value={activity.type.actType ?? "-"}
                  className="bg-gray-100 text-gray-500 font-medium"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Wykonawca</Label>
                <Input
                  disabled
                  value={activity.executor?.name ?? "-"}
                  className="bg-gray-100 text-gray-500"
                />
              </div>

              {canEdit ? (
                <Controller
                  name="status"
                  control={control}
                  render={({ field, fieldState }) => (
                    <RepairStatusSelect
                      field={field}
                      fieldState={fieldState}
                      label="Status"
                      showAllOption={false}
                    />
                  )}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <Input
                    disabled
                    value={translateStatus(activity.status)}
                    className="bg-gray-100 text-gray-500 font-medium"
                  />
                </div>
              )}
            </div>

            {/* Pola Textarea (Opis i Wynik) */}
            <div className="flex flex-col gap-2">
              <Label>Opis</Label>
              <Textarea
                id="description"
                disabled
                value={activity.description}
                className="bg-gray-100 text-gray-500 min-h-[100px]"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="result">Wynik</Label>
              {canEdit ? (
                <>
                  <Controller
                    name="result"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="result"
                        {...field}
                        className="bg-gray-50/50 min-h-[100px]"
                      />
                    )}
                  />
                  {actionData?.fieldErrors?.result && (
                    <span className="text-xs text-destructive">
                      {actionData.fieldErrors.result[0]}
                    </span>
                  )}
                </>
              ) : (
                <Textarea
                  id="result"
                  disabled
                  value={activity.result ?? "Brak wpisanego wyniku"}
                  className="bg-gray-100 text-gray-500 min-h-[100px]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Przyciski Akcji na dole strony */}
        <div className="flex items-center gap-3 self-start">
          {canEdit ? (
            <>
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800"
              >
                Zapisz
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="bg-gray-100 text-black hover:bg-gray-200"
                onClick={() => navigate(`/activities`)}
              >
                Anuluj
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="bg-gray-100 text-black hover:bg-gray-200"
              onClick={() => navigate(`/activities`)}
            >
              Powrót
            </Button>
          )}
        </div>
      </Form>
    </PageLayout>
  );
}
