import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Form,
  useNavigate,
  useParams,
  useSubmit,
  useActionData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  useFetcher,
  useLoaderData,
} from "react-router";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import PageLayout from "~/layouts/PageLayout";
import z from "zod";
import { EditRequestFormSchema, type EditRequestFormData } from "./schema";
import { requireManager } from "~/lib/auth.server";
import { clientService } from "../client/client-service";
import { deviceService } from "../device/device.service";
import { requestsService } from "./requests-service";
import type { Device } from "~/types/device";
import { useEffect } from "react";
import { activitiesService } from "../activities/activities-service";
import type { Activity } from "../activities/schema";
import { RepairStatusBadge } from "~/components/Badge";
import type { RepairStatus } from "~/types/status";
import { useActionToast } from "~/hooks/useActionToast";
import { RepairStatusSelect } from "~/components/Select";

export async function loader({ request, params }: LoaderFunctionArgs) {
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
      return {
        requestData: null,
        clients: [],
        devices: result.data,
        deviceData: null,
        currentClient: null,
      };
    } catch (error) {
      return {
        requestData: null,
        clients: [],
        devices: [],
        deviceData: null,
        currentClient: null,
      };
    }
  }

  const id = Number(params.id);
  if (isNaN(id)) throw new Response("Nieprawidłowe ID", { status: 400 });

  const requestData = await requestsService.getRequestById(request, id);
  if (!requestData)
    throw new Response("Zgłoszenie nie znalezione", { status: 404 });

  const deviceData = requestData.deviceId
    ? await deviceService.getDeviceById(request, requestData.deviceId)
    : null;

  const currentClient = await clientService.getClientById(
    request,
    deviceData?.clientId || 0,
  );

  const clientResponse = await clientService.fetchClientList(request, {
    sort: "asc",
    limit: 100,
    page: 1,
  });

  const activities = await activitiesService.fetchActivitesForRequest(
    id,
    request,
  );

  return {
    requestData,
    clients: clientResponse.data,
    devices: [],
    activities,
    deviceData,
    currentClient,
  };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const loggedUser = await requireManager(request);
  const id = Number(params.id);
  const payload = await request.json();
  const parsed = EditRequestFormSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      success: false,
    };
  }

  try {
    const payloadForApi = {
      id: id,
      deviceId: Number(parsed.data.deviceId),
      description: parsed.data.description,
      status: parsed.data.status,
      managerId: loggedUser.id,
      result: parsed.data.result,
    };

    await requestsService.updateRequest(id, payloadForApi as any, request);

    return {
      success: true,
    };
  } catch (error) {
    console.error("=== [DEBUG] BŁĄD ZAPISU ===", error);
    return {
      success: false,
      formError: "Wystąpił błąd podczas zapisywania zmian. Spróbuj ponownie.",
    };
  }
}

export const handle = {
  breadcrumb: () => "edycja",
};

export default function RequestEditPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const { id } = useParams();
  const actionData = useActionData<typeof action>();

  useActionToast(actionData, "Zgłoszenie zostało zaktualizowane");

  const { requestData, clients, activities, deviceData, currentClient } =
    useLoaderData<typeof loader>();
  const deviceFetcher = useFetcher<{ devices: Device[] }>();

  const currentDeviceId =
    requestData?.device?.id?.toString() ||
    requestData?.deviceId?.toString() ||
    "";
  const currentDeviceName =
    deviceData?.deviceName || "Obecnie przypisane urządzenie";
  const currentClientId = currentClient?.id?.toString() || "";

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EditRequestFormData>({
    resolver: zodResolver(EditRequestFormSchema),
    reValidateMode: "onChange",
    defaultValues: {
      clientId: currentClientId,
      deviceId: currentDeviceId,
      status: requestData?.status || "REGISTERED",
      description: requestData?.description || "",
      result: requestData?.result || "",
    },
  });

  const selectedClientId = useWatch({ control, name: "clientId" });

  useEffect(() => {
    if (selectedClientId) {
      deviceFetcher.load(`?clientId=${selectedClientId}`);
      if (selectedClientId !== currentClientId) {
        setValue("deviceId", "");
      }
    }
  }, [selectedClientId, currentClientId, setValue]);

  const onSubmit = (data: EditRequestFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  const fetchedDevices = deviceFetcher.data?.devices || [];
  const isLoadingDevices = deviceFetcher.state === "loading";
  const hasFetchedData = deviceFetcher.data !== undefined;
  const hasNoDevices =
    deviceFetcher.data !== undefined && fetchedDevices.length === 0;
  const displayDevices = hasFetchedData
    ? fetchedDevices
    : currentDeviceId
      ? [{ id: Number(currentDeviceId), deviceName: currentDeviceName }]
      : [];

  const descriptionError =
    errors.description?.message || actionData?.fieldErrors?.description?.[0];
  const deviceError =
    errors.deviceId?.message || actionData?.fieldErrors?.deviceId?.[0];
  const clientError =
    errors.clientId?.message || actionData?.fieldErrors?.clientId?.[0];
  const statusError =
    errors.status?.message || actionData?.fieldErrors?.status?.[0];

  const resultError =
    errors.result?.message || actionData?.fieldErrors?.result?.[0];

  return (
    <PageLayout title="Edycja Zgłoszenia">
      <div className="flex flex-col gap-10">
        {/* SEKCJA GŁÓWNA - FORMULARZ INFORMACJI */}
        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {actionData?.formError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm">
              <p className="font-medium">Błąd zapisu</p>
              <p className="text-sm">{actionData.formError}</p>
            </div>
          )}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Informacje
            </h2>
            <Separator className="mb-6" />

            <div className="flex flex-col gap-6">
              {/* Rząd 1: Grid 3 kolumny */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Klient */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientId">Klient</Label>
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger id="clientId" className="bg-gray-50/50">
                          <SelectValue placeholder="Wybierz klienta" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients?.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.firstName} {c.surname}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />{" "}
                  {clientError && (
                    <span className="text-xs text-destructive">
                      {clientError}
                    </span>
                  )}
                </div>

                {/* Urządzenie */}
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
                              isLoadingDevices
                                ? "Ładowanie..."
                                : hasNoDevices
                                  ? "Brak dostępnych urządzeń"
                                  : "Wybierz urządzenie"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {displayDevices.map((d) => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.deviceName}
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

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <RepairStatusSelect
                        label="Status"
                        field={field}
                        fieldState={fieldState}
                      />
                    )}
                  />

                  {statusError && (
                    <span className="text-xs text-destructive">
                      {statusError}
                    </span>
                  )}
                </div>
              </div>

              {/* Rząd 2 i 3: Opis i Rezultat */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Opis</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="description"
                      {...field}
                      className="bg-gray-50/50 min-h-[120px]"
                    />
                  )}
                />

                {descriptionError && (
                  <span className="text-xs text-destructive">
                    {descriptionError}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="result">Rezultat</Label>
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      id="result"
                      {...field}
                      placeholder="Podsumowanie wykonanych prac..."
                      className="bg-gray-50/50 min-h-[120px]"
                    />
                  )}
                />

                {resultError && (
                  <span className="text-xs text-destructive">
                    {resultError}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Przyciski Akcji Formularza */}
          <div className="flex items-center gap-3">
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
              onClick={() => navigate(-1)}
            >
              Anuluj
            </Button>
          </div>
        </Form>

        {/* SEKCJA AKTYWNOŚCI */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Aktywności</h2>
            <Button
              variant="outline"
              className="bg-white text-black border-gray-300 hover:bg-gray-50"
              onClick={() => {
                navigate(`/requests/${id}/activities/new`);
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Dodaj aktywność
            </Button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-100">
                <TableRow>
                  <TableHead className="w-[60px]">
                    <div className="flex items-center gap-1">Lp.</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">Typ</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">Opis</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">Wykonawca</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">Status</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">Utworzono</div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">Zakończono</div>
                  </TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities && activities.length > 0 ? (
                  activities?.map((act: Activity, idx: number) => (
                    <TableRow
                      key={act.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() =>
                        navigate(`/requests/${id}/activities/${act.id}`)
                      }
                    >
                      <TableCell className="font-medium">{act.seqNo}</TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {act.type.actType}
                      </TableCell>
                      <TableCell className="text-gray-500 max-w-[250px] truncate">
                        {act.description}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {act.executor && act.executor.name}
                      </TableCell>
                      <TableCell className="">
                        <RepairStatusBadge
                          status={act.status as RepairStatus}
                          className="align-center"
                        />
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(act.dateRegistration).toLocaleDateString(
                          "pl-PL",
                        )}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {act.dateFinishedCancelled
                          ? new Date(
                              act.dateFinishedCancelled,
                            ).toLocaleDateString("pl-PL")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-gray-500"
                    >
                      Brak przypisanych aktywności.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
