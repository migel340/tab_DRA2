import {
  useNavigate,
  useParams,
  type LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
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
import PageLayout from "~/layouts/PageLayout";
import { activitiesService } from "./activities-service";
import z from "zod";
import { requestsService } from "../requests/requests-service";
import { deviceService } from "../device/device-service";
import { clientService } from "../client/client-service";
import { RepairStatusBadge } from "~/components/Badge";
import type { RepairStatus } from "~/types/status";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;

  const result = z.coerce.number().safeParse(id);
  if (!result.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const _request = await requestsService.getRequestById(request, result.data);

  const device = await deviceService.getDeviceById(
    request,
    _request?.deviceId as number,
  );

  const client = await clientService.getClientById(
    request,
    device?.clientId as number,
  );

  const activites = await activitiesService.fetchActivitesForRequest(
    result.data,
    request,
  );

  return { request: _request, device, client, activites };
}

export const handle = {
  breadcrumb: () => "szczegóły zgłoszenia",
};

export default function RequestDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { request, client, device, activites } = useLoaderData<typeof loader>();

  return (
    <PageLayout title="Szczegóły Zgłoszenia">
      <div className="flex flex-col gap-10">
        {/* SEKCJA GŁÓWNA - FORMULARZ INFORMACJI */}
        <div className="flex flex-col gap-6">
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
                  <Input
                    disabled
                    value={`${client?.firstName + " " + client?.surname}`}
                    className="bg-gray-100 text-gray-500 font-medium"
                  />
                </div>

                {/* Urządzenie */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deviceId">Urządzenie</Label>
                  <Input
                    disabled
                    value={`${device?.deviceName}`}
                    className="bg-gray-100 text-gray-500 font-medium"
                  />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <RepairStatusBadge status={request?.status as RepairStatus} />
                </div>
              </div>

              {/* Rząd 2 i 3: Opis i Rezultat */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Opis</Label>
                <Textarea
                  id="description"
                  disabled
                  value={request?.description}
                  className="bg-gray-100 text-gray-500 min-h-[100px]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="result">Rezultat</Label>
                <Textarea
                  id="result"
                  disabled
                  value={request?.result ?? ""}
                  className="bg-gray-100 text-gray-500 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEKCJA AKTYWNOŚCI */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Aktywności</h2>
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
                {activites.map((act, idx) => (
                  <TableRow
                    key={act.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/activities/request/${request?.id}/activity/${act.id}`)}
                  >
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {act.type.actType}
                    </TableCell>
                    <TableCell className="text-gray-500 max-w-[250px] truncate">
                      {act.description}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {act.executor?.name}
                    </TableCell>
                    <TableCell>
                      <RepairStatusBadge status={act.status as RepairStatus} />
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
