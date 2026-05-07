import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate, useSubmit, useParams, useActionData, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "react-router";
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
import { Input } from "~/components/ui/input";
import PageLayout from "~/layouts/PageLayout";
import { MOCK_ACTIVITY_TYPES, MOCK_EXECUTORS, MOCK_STATUSES, MOCK_ACTIVITIES } from "~/mocks/requests";
import { EditActivityFormSchema, type EditActivityFormData } from "./schema";

export async function loader({ params }: LoaderFunctionArgs) {
  const { activityId } = params;
  
  // TODO: Docelowo pobranie z API np. await activitiesService.getById(activityId)
  const activity = MOCK_ACTIVITIES.find(a => a.id.toString() === activityId) || {
    id: activityId,
    created: "10-05-2024",
    finished: "-",
    desc: "Brak opisu",
  };

  return { activity };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const payload = await request.json();
  const parsed = EditActivityFormSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  // TODO: wywołanie API np: await activitiesService.update(params.activityId, parsed.data)
  
  // Powrót do widoku zgłoszenia po udanej edycji
  return redirect(`/requests/${params.id}`);
}

export const handle = {
  breadcrumb: () => "szczegóły",
};

export default function ActivityEditPage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const { activity } = useLoaderData<typeof loader>();
  const { id } = useParams();

  const { handleSubmit, control } = useForm<EditActivityFormData>({
    resolver: zodResolver(EditActivityFormSchema),
    defaultValues: {
      type: "diagnoza", // Mapowanie na id z mocków
      executor: "1",
      status: "closed",
      description: activity.desc || "",
      result: "Wymieniono uszkodzony układ zasilania.",
    },
  });

  const onSubmit = (data: EditActivityFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Edytuj aktywność">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        
        {/* Główna karta formularza */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            
            {/* Górny wiersz (Read-only) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Numer Sekwencji</Label>
                <Input disabled value={`#${activity.id}`} className="bg-gray-100 text-gray-500 font-medium" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Utworzono</Label>
                <Input disabled value={activity.created} className="bg-gray-100 text-gray-500" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Zakończono</Label>
                <Input disabled value={activity.finished} className="bg-gray-100 text-gray-500" />
              </div>
            </div>

            {/* Środkowy wiersz z Selectami (3 kolumny) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pole Typ */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="type">Typ</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="type" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz typ" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ACTIVITY_TYPES.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {actionData?.fieldErrors?.type && <span className="text-xs text-destructive">{actionData.fieldErrors.type[0]}</span>}
              </div>

              {/* Pole Wykonawca */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="executor">Wykonawca</Label>
                <Controller
                  name="executor"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="executor" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz wykonawcę" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_EXECUTORS.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {actionData?.fieldErrors?.executor && <span className="text-xs text-destructive">{actionData.fieldErrors.executor[0]}</span>}
              </div>

              {/* Pole Status */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_STATUSES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.id === 'closed' ? (
                              <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-medium">{s.name}</span>
                            ) : (
                              s.name
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {actionData?.fieldErrors?.status && <span className="text-xs text-destructive">{actionData.fieldErrors.status[0]}</span>}
              </div>
            </div>

            {/* Pola Textarea (Opis i Wynik) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Opis</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" {...field} className="bg-gray-50/50 min-h-[100px]" />}
              />
              {actionData?.fieldErrors?.description && <span className="text-xs text-destructive">{actionData.fieldErrors.description[0]}</span>}
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
            onClick={() => navigate(`/requests/${id}`)}
          >
            Anuluj
          </Button>
        </div>
      </Form>
    </PageLayout>
  );
}