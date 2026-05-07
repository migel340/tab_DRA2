import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate, useSubmit, useParams, useActionData, type ActionFunctionArgs, redirect } from "react-router";
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
import { MOCK_ACTIVITY_TYPES, MOCK_EXECUTORS } from "~/mocks/requests";
import { NewActivityFormSchema, type NewActivityFormData } from "./schema";

export async function action({ request, params }: ActionFunctionArgs) {
  const payload = await request.json();
  const parsed = NewActivityFormSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  // TODO: wywołanie API np: await activitiesService.create(params.id, parsed.data)
  
  // Powrót do widoku zgłoszenia po udanym utworzeniu
  return redirect(`/requests/${params.id}`);
}

export const handle = {
  breadcrumb: () => "nowa",
};

export default function ActivityCreatePage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  // Pobieramy ID zgłoszenia z adresu, w celu ewentualnego użycia go w UI (np. powrót)
  const { id } = useParams();

  const { handleSubmit, control } = useForm<NewActivityFormData>({
    resolver: zodResolver(NewActivityFormSchema),
    defaultValues: {
      type: "",
      executor: "",
      description: "",
    },
  });

  const onSubmit = (data: NewActivityFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Dodaj nową aktywność">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Główna karta formularza */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* Rząd z listami rozwijanymi (2 kolumny) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
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
                {actionData?.fieldErrors?.type && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.type[0]}</span>
                )}
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
                {actionData?.fieldErrors?.executor && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.executor[0]}</span>
                )}
              </div>
            </div>

            {/* Pole Opis (Textarea) */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Opis</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea id="description" {...field} className="bg-gray-50/50 min-h-[120px]" />
                )}
              />
              {actionData?.fieldErrors?.description && (
                <span className="text-xs text-destructive">{actionData.fieldErrors.description[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Przyciski Akcji na dole strony */}
        <div className="flex items-center gap-3 self-start">
          <Button type="submit" className="bg-black text-white hover:bg-gray-800">
            Stwórz
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