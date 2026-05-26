import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate, useSubmit, useActionData, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import PageLayout from "~/layouts/PageLayout";
import { RepairStatusSelect } from "~/components/Select";
import { MOCK_CLIENTS, MOCK_DEVICES, MOCK_STATUSES, MOCK_ACTIVITIES } from "~/mocks/requests";
import { EditPersonelActivityFormSchema, type EditPersonelActivityFormData } from "./schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";


export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  // TODO: Docelowo pobranie z API np. await activitiesService.getById(id)
  const activity = MOCK_ACTIVITIES.find(a => a.id.toString() === id);
  if (!activity) throw new Response("Not Found", { status: 404 });

  const request = {
    id,
    client: MOCK_CLIENTS[0].name,
    device: MOCK_DEVICES[0].name,
    description: "Klient zgłasza brak reakcji na przycisk zasilania.",
    status: "W trakcie"
  };

  const currentUser = { role: "MANAGER" };

  return { activity, request, currentUser };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const payload = await request.json();
  const parsed = EditPersonelActivityFormSchema.safeParse(payload);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  // TODO: wywołanie API np: await activitiesService.update(params.id, parsed.data)

  return redirect(`/activities`);
}

export const handle = {
  breadcrumb: () => "szczegóły",
};

export default function PersonelActivityEditPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const { activity, request, currentUser } = useLoaderData<typeof loader>();
  //const { id } = useParams();

  const { handleSubmit, control, watch } = useForm<EditPersonelActivityFormData>({
    resolver: zodResolver(EditPersonelActivityFormSchema),
    defaultValues: {
      sequenceNumber: activity.id.toString(),
      status: activity.status || "OPN",
      result: "Wymieniono uszkodzony układ zasilania.",
    },
  });

  const currentStatus = watch("status");

  const onSubmit = (data: EditPersonelActivityFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Edytuj aktywność">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Zgłoszenie</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* Rząd 1: Grid 3 kolumny */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Klient */}
              <div className="flex flex-col gap-2">
                <Label>Klient</Label>
                <Input disabled value={`${request.client}`} className="bg-gray-100 text-gray-500 font-medium" />
              </div>

              {/* Urządzenie */}
              <div className="flex flex-col gap-2">
                <Label>Urządzenie</Label>
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
              <Label>Opis</Label>
              <Textarea id="description" disabled value={request.description} className="bg-gray-100 text-gray-500 min-h-[100px]" />
            </div>
            {/* Przyciski Akcji Formularza */}
            <div className="flex items-center gap-3">
              <Button type="button" className="bg-black text-white hover:bg-gray-800" onClick={() => navigate(`/activities/request-details/${request.id}`)}>Zobacz</Button>
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
                <Controller
                  name="sequenceNumber"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      {...field}
                      disabled={currentUser?.role !== "MANAGER"} 
                      className={currentUser?.role === "MANAGER" ? "bg-white font-medium text-gray-900" : "bg-gray-100 text-gray-500 font-medium"} 
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Data utworzenia</Label>
                <Input disabled defaultValue={activity.created} className="bg-gray-100 text-gray-500" />
              </div>
              {(currentStatus === "FIN" || currentStatus === "CAN") && (
                <div className="flex flex-col gap-2">
                  <Label>Data zakończenia</Label>
                  <Input disabled defaultValue={activity.finished} className="bg-gray-100 text-gray-500" />
                </div>
              )}
            </div>

            {/* Środkowy wiersz z Selectami (3 kolumny) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Typ</Label>
                <Input disabled value={`${activity.type}`} className="bg-gray-100 text-gray-500 font-medium" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Wykonawca</Label>
                <Input disabled value={activity.executor} className="bg-gray-100 text-gray-500" />
              </div>

              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <RepairStatusSelect
                    field={field}
                    fieldState={fieldState}
                    label="Status"
                    showAllOption={false}
                    getOptionValue={(option) => option}
                    getOptionKey={(option) => option}
                  />
                )}
              />
            </div>

            {/* Pola Textarea (Opis i Wynik) */}
            <div className="flex flex-col gap-2">
              <Label>Opis</Label>
              <Textarea id="description" disabled value={activity.desc} className="bg-gray-100 text-gray-500 min-h-[100px]" />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="result">Wynik</Label>
              <Controller
                name="result"
                control={control}
                render={({ field }) => <Textarea id="result" {...field} className="bg-gray-50/50 min-h-[100px]" />}
              />
              {actionData?.fieldErrors?.result && <span className="text-xs text-destructive">{actionData.fieldErrors.result[0]}</span>}
            </div>

          </div>
        </div>

        {/* Przyciski Akcji na dole strony */}
        <div className="flex items-center gap-3 self-start">
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
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
        </div>
      </Form>
    </PageLayout>
  );
}