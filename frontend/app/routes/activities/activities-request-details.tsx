import { useNavigate, useParams, type LoaderFunctionArgs, useLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
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
import { Badge } from "~/components/ui/badge";
import { ArrowUpDown, Plus, Trash2 } from "lucide-react";
import PageLayout from "~/layouts/PageLayout";
import { MOCK_CLIENTS, MOCK_DEVICES, MOCK_STATUSES, MOCK_ACTIVITIES } from "~/mocks/requests";

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: pobranie danych z API na podstawie ID
  const request = {
    id: params.id,
    client: "Jan Kowalski",
    device: "mac m1",
    status: "open",
    description: "Klient zgłasza brak reakcji na przycisk zasilania. Laptop wyłączył się podczas pracy.",
    result: "Wstępna weryfikacja potwierdziła uszkodzenie sekcji zasilania.",
  };

  return { request };
}

export const handle = {
  breadcrumb: () => "szczegóły zgłoszenia",
};

export default function RequestDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { request } = useLoaderData<typeof loader>();
  const clientName = MOCK_CLIENTS.find(c => c.id === request.client)?.name;
  const deviceName = MOCK_DEVICES.find(d => d.id === request.device)?.name;
  const statusName = MOCK_STATUSES.find(s => s.id === request.status)?.name;

  return (
    <PageLayout title="Szczegóły Zgłoszenia">
      <div className="flex flex-col gap-10">
        
        {/* SEKCJA GŁÓWNA - FORMULARZ INFORMACJI */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Informacje</h2>
            <Separator className="mb-6" />

            <div className="flex flex-col gap-6">
              {/* Rząd 1: Grid 3 kolumny */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Klient */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientId">Klient</Label>
                  <Input disabled value={`${request.client}`} className="bg-gray-100 text-gray-500 font-medium" />
                </div>

                {/* Urządzenie */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deviceId">Urządzenie</Label>
                  <Input disabled value={`${request.device}`} className="bg-gray-100 text-gray-500 font-medium" />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Input disabled value={`${request.status}`} className="bg-gray-100 text-gray-500 font-medium" />
                </div>
              </div>

              {/* Rząd 2 i 3: Opis i Rezultat */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Opis</Label>
                <Textarea id="description" disabled value={request.description} className="bg-gray-100 text-gray-500 min-h-[100px]" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="result">Rezultat</Label>
                <Textarea id="result" disabled value={request.result} className="bg-gray-100 text-gray-500 min-h-[100px]" />
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
                  <TableHead className="w-[60px]"><div className="flex items-center gap-1">Lp. <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead><div className="flex items-center gap-1">Typ <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead><div className="flex items-center gap-1">Opis <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead><div className="flex items-center gap-1">Wykonawca <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead><div className="flex items-center gap-1">Status <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead><div className="flex items-center gap-1">Utworzono <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead><div className="flex items-center gap-1">Zakończono <ArrowUpDown className="h-3 w-3 opacity-50"/></div></TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ACTIVITIES.map((act, idx) => (
                  <TableRow 
                    key={act.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/activities/request/${id}/activity/${act.id}`)}
                  >
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-gray-900">{act.type}</TableCell>
                    <TableCell className="text-gray-500 max-w-[250px] truncate">{act.desc}</TableCell>
                    <TableCell className="text-gray-700">{act.executor}</TableCell>
                    <TableCell><Badge variant="outline" className={act.status === "Aktywne" ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>{act.status}</Badge></TableCell>
                    <TableCell className="text-gray-500">{act.created}</TableCell>
                    <TableCell className="text-gray-500">{act.finished}</TableCell>
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