import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate, useParams, useSubmit, useActionData, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "react-router";
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
import { Badge } from "~/components/ui/badge";
import { ArrowUpDown, Plus, Trash2 } from "lucide-react";
import PageLayout from "~/layouts/PageLayout";
import { EditRequestFormSchema, type EditRequestFormData } from "./schema";
import { MOCK_CLIENTS, MOCK_DEVICES, MOCK_STATUSES, MOCK_ACTIVITIES } from "~/mocks/requests";

export async function loader({ params }: LoaderFunctionArgs) {
  // TODO: pobranie danych z API na podstawie ID
  return { id: params.id };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const payload = await request.json();
  const parsed = EditRequestFormSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  // TODO: wykonanie aktualizacji w warstwie API 
  return redirect("/requests");
}

export const handle = {
  breadcrumb: () => "edycja",
};

export default function RequestEditPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const { id } = useParams();
  const actionData = useActionData<typeof action>();

  const { handleSubmit, control } = useForm<EditRequestFormData>({
    resolver: zodResolver(EditRequestFormSchema),
    defaultValues: {
      clientId: "1", // Przykładowo załadowane dane
      deviceId: "101",
      status: "OPN",
      description: "Klient zgłasza brak reakcji na przycisk zasilania. Laptop wyłączył się podczas pracy.",
      result: "",
    },
  });

  const onSubmit = (data: EditRequestFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Edycja Zgłoszenia">
      <div className="flex flex-col gap-10">
        
        {/* SEKCJA GŁÓWNA - FORMULARZ INFORMACJI */}
        <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">Informacje</h2>
            <Separator className="mb-6" />

            <div className="flex flex-col gap-6">
              {/* Rząd 1: Grid 3 kolumny */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Klient */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="clientId">Klient</Label>
                  <Controller name="clientId" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="clientId" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CLIENTS.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  )} />
                </div>

                {/* Urządzenie */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="deviceId">Urządzenie</Label>
                  <Controller name="deviceId" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="deviceId" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz urządzenie" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_DEVICES.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  )} />
                </div>

                {/* Status */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Controller name="status" control={control} render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_STATUSES.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>

              {/* Rząd 2 i 3: Opis i Rezultat */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Opis</Label>
                <Controller name="description" control={control} render={({ field }) => (
                  <Textarea id="description" {...field} className="bg-gray-50/50 min-h-[120px]" />
                )} />
                {actionData?.fieldErrors?.clientId && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.clientId[0]}</span>
                )}
                {actionData?.fieldErrors?.deviceId && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.deviceId[0]}</span>
                )}
                {actionData?.fieldErrors?.status && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.status[0]}</span>
                )}
                {actionData?.fieldErrors?.description && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.description[0]}</span>
                )}
                {actionData?.fieldErrors?.result && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.result[0]}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="result">Rezultat</Label>
                <Controller name="result" control={control} render={({ field }) => (
                  <Textarea id="result" {...field} placeholder="Podsumowanie wykonanych prac..." className="bg-gray-50/50 min-h-[120px]" />
                )} />
              </div>
            </div>
          </div>

          {/* Przyciski Akcji Formularza */}
          <div className="flex items-center gap-3">
            <Button type="submit" className="bg-black text-white hover:bg-gray-800">Zapisz</Button>
            <Button type="button" variant="secondary" className="bg-gray-100 text-black hover:bg-gray-200" onClick={() => navigate(-1)}>Anuluj</Button>
          </div>
        </Form>

        {/* SEKCJA AKTYWNOŚCI */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Aktywności</h2>
            <Button 
              variant="outline" 
              className="bg-white text-black border-gray-300 hover:bg-gray-50"
              onClick={() => navigate(`/requests/${id}/activities/new`)}
            >
              <Plus className="mr-2 h-4 w-4" /> Dodaj aktywność
            </Button>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-stone-100">
                <TableRow>
                  <TableHead className="w-[60px]">Lp.</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead>Opis</TableHead>
                  <TableHead>Wykonawca</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data utworzenia</TableHead>
                  <TableHead>Data zakończenia</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_ACTIVITIES.map((act, idx) => (
                  <TableRow 
                    key={act.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/requests/${id}/activities/${act.id}`)}
                  >
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell className="font-medium text-gray-900">{act.type}</TableCell>
                    <TableCell className="text-gray-500 max-w-[250px] truncate">{act.desc}</TableCell>
                    <TableCell className="text-gray-700">{act.executor}</TableCell>
                    <TableCell><Badge variant="outline" className={act.status === "Aktywne" ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>{act.status}</Badge></TableCell>
                    <TableCell className="text-gray-500">{act.created}</TableCell>
                    <TableCell className="text-gray-500">{act.finished}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Blokuje kliknięcie w cały wiersz
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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