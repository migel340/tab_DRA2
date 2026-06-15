import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect } from "react";
import {
  Form,
  useNavigate,
  useSubmit,
  useActionData,
  redirect,
  useLoaderData,
  useFetcher,
} from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import PageLayout from "~/layouts/PageLayout";
import z from "zod";
import { NewRequestFormSchema, type NewRequestFormData } from "./schema";
import { requestsService } from "./requests-service";
import { requireManager } from "~/lib/auth.server";
import { deviceService } from "../device/device.service";
import { clientService } from "../client/client-service";
import type { Device } from "~/types/device";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireManager(request);

  const url = new URL(request.url);
  const clientId = url.searchParams.get("clientId");
  if (clientId) {
    try {
      const result = await deviceService.fetchDeviceList(
        Number(clientId),
        request,
        { sort: "asc", limit: 100, page: 1 },
      );
      return { clients: [], devices: result.data };
    } catch (error) {
      return { clients: [], devices: [] };
    }
  }
  const clientResponse = await clientService.fetchClientList(request, {
    sort: "asc",
    limit: 100,
    page: 1,
  });
  return { clients: clientResponse.data, devices: [] };
}

export async function action({ request }: ActionFunctionArgs) {
  const loggedUser = await requireManager(request);

  const payload = await request.json();
  const parsed = NewRequestFormSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      status: 400,
    };
  }

  try {
    const payloadForApi = {
      deviceId: Number(parsed.data.deviceId),
      description: parsed.data.description,
      status: "REGISTERED",
      managerId: loggedUser.id,
    };
    await requestsService.createRequest(payloadForApi, request);
    return redirect("/requests");
  } catch (error) {
    console.error("=== [DEBUG] BŁĄD WYSYŁANIA ===", error);
    return {
      success: false,
      formError: "Nie udało się połączyć z API lub serwer odrzucił żądanie.",
    };
  }
}

export const handle = {
  breadcrumb: () => "nowe",
};

export default function RequestCreatePage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  const { clients } = useLoaderData<typeof loader>();
  const deviceFetcher = useFetcher<{ devices: Device[] }>();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<NewRequestFormData>({
    resolver: zodResolver(NewRequestFormSchema),
    reValidateMode: "onChange",
    defaultValues: {
      clientId: "",
      deviceId: "",
      description: "",
    },
  });

  const selectedClientId = useWatch({
    control,
    name: "clientId",
  });

  useEffect(() => {
    if (selectedClientId) {
      deviceFetcher.load(`?clientId=${selectedClientId}`);
      setValue("deviceId", "");
    }
  }, [selectedClientId, setValue]);

  const onSubmit = (data: NewRequestFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  const devices = deviceFetcher.data?.devices || [];
  const isLoadingDevices = deviceFetcher.state === "loading";
  const hasNoDevices = deviceFetcher.data !== undefined && devices.length === 0;

  const descriptionError =
    errors.description?.message || actionData?.fieldErrors?.description?.[0];
  const deviceError =
    errors.deviceId?.message || actionData?.fieldErrors?.deviceId?.[0];
  const clientError =
    errors.clientId?.message || actionData?.fieldErrors?.clientId?.[0];

  return (
    <PageLayout title="Dodaj nowe zgłoszenie">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* DODANE: Wyświetlanie błędu z catch() */}
        {actionData?.formError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
            <p className="font-medium">Błąd zapisu</p>
            <p className="text-sm">{actionData.formError}</p>
          </div>
        )}
        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* First Row: Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="clientId">Klient</Label>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="clientId" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem
                            key={client.id}
                            value={client.id.toString()}
                          >
                            {client.firstName} {client.surname}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {clientError && (
                  <span className="text-xs text-destructive">
                    {clientError}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deviceId">Urządzenie</Label>
                <Controller
                  name="deviceId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={
                        !selectedClientId || isLoadingDevices || hasNoDevices
                      }
                    >
                      <SelectTrigger id="deviceId" className="bg-gray-50/50">
                        <SelectValue
                          placeholder={
                            !selectedClientId
                              ? "Najpierw wybierz klienta"
                              : isLoadingDevices
                                ? "Ładowanie..."
                                : hasNoDevices
                                  ? "Brak dostępnych urządzeń"
                                  : "Wybierz urządzenie"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {devices.map((device) => (
                          <SelectItem
                            key={device.id}
                            value={device.id.toString()}
                          >
                            {device.deviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {deviceError && (
                  <span className="text-xs text-destructive">
                    {deviceError}
                  </span>
                )}
              </div>
            </div>

            {/* Second Row: Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Opis</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Wprowadź szczegółowy opis zgłoszenia..."
                    className="bg-gray-50/50 min-h-[150px]"
                  />
                )}
              />

              {descriptionError && (
                <span className="text-xs text-destructive">
                  {descriptionError}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start">
          <Button type="submit" className="bg-black text-white">
            Stwórz
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Anuluj
          </Button>
        </div>
      </Form>
    </PageLayout>
  );
}
