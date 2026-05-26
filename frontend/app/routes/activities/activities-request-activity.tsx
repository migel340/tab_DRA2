import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate, useParams, useSubmit, useActionData, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import PageLayout from "~/layouts/PageLayout";
import { RepairStatusSelect, SelectField } from "~/components/Select";
import { MOCK_ACTIVITY_TYPES, MOCK_EXECUTORS, MOCK_STATUSES, MOCK_ACTIVITIES } from "~/mocks/requests";
import { EditActivityFormSchema, type EditActivityFormData } from "./schema";
import { ChevronLeft } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  const { activityId } = params;
  
  // Symulacja zalogowanego użytkownika (Piotr Wiśniewski)
  const currentUser = {
    fullName: "Piotr Wiśniewski", 
    role: "PERSONEL"
  };

  const activity = MOCK_ACTIVITIES.find(a => a.id.toString() === activityId) || {
    id: activityId,
    created: "10-05-2024",
    finished: "-",
    desc: "Brak opisu",
    executor: "Piotr Wiśniewski",
    status: "OPN",
    type: "diagnoza",
    result: ""
  };

  return { activity, currentUser };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const payload = await request.json();
  const parsed = EditActivityFormSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  return redirect(`/requests/${params.id}`);
}

export default function ActivityEditPage() {
  const { activity, currentUser } = useLoaderData<typeof loader>();
  const { id } = useParams();
  const navigate = useNavigate();
  const submit = useSubmit();
  const actionData = useActionData<typeof action>();

  // --- LOGIKA UPRAWNIEŃ ---
  const isExecutor = activity.executor === currentUser.fullName;

  const { handleSubmit, control, watch } = useForm<EditActivityFormData>({
    resolver: zodResolver(EditActivityFormSchema),
    defaultValues: {
      sequenceNumber: activity.id?.toString() || "",
      type: activity.type || "diagnoza",
      executor: "1",
      status: activity.status || "OPN",
      description: activity.desc || "",
      result: "",
    },
  });

  const currentStatus = watch("status");

  // Helpery do tekstowego wyświetlania wartości w trybie ReadOnly
  const currentStatusName = MOCK_STATUSES.find(s => s.id === activity.status)?.name || activity.status;
  const currentTypeName = MOCK_ACTIVITY_TYPES.find(t => t.id === activity.type)?.name || activity.type;

  const onSubmit = (data: EditActivityFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Szczegóły aktywności">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Informacje</h2>
          </div>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* Rząd 1: Systemowe (zawsze ReadOnly) */}
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
                <Input disabled defaultValue={activity.created} className="bg-gray-100 text-gray-500 font-medium" />
              </div>
              {(currentStatus === "FIN" || currentStatus === "CAN") && (
                <div className="flex flex-col gap-2">
                  <Label>Data zakończenia</Label>
                  <Input disabled defaultValue={activity.finished} className="bg-gray-100 text-gray-500 font-medium" />
                </div>
              )}
            </div>

            {/* Rząd 2: Typ, Wykonawca, Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Typ</Label>
                <Input disabled value={currentTypeName} className="bg-gray-100 text-gray-500 font-medium" />
              </div>

              <div className="flex flex-col gap-2">
                <Label>Wykonawca</Label>
                <Input disabled value={activity.executor} className="bg-gray-100 text-gray-500 font-medium" />
              </div>

              <div className="flex flex-col gap-2">
                {isExecutor ? (
                  <Controller
                    name="status"
                    control={control}
                    render={({ field, fieldState }) => (
                      <RepairStatusSelect
                        field={field}
                        fieldState={fieldState}
                        label="Status" 
                        showAllOption={false}
                        getOptionValue={(opt: any) => opt.id}
                        getOptionKey={(opt: any) => opt.id}
                      />
                    )}
                  />
                ) : (
                  <Input disabled value={currentStatusName} className="bg-gray-100 text-gray-500 font-medium" />
                )}
              </div>
            </div>

            {/* Opis - Zawsze tylko do odczytu dla pracownika */}
            <div className="flex flex-col gap-2">
              <Label>Opis</Label>
              <Textarea id="description" disabled value={activity.desc} className="bg-gray-100 text-gray-500 min-h-[100px]" />
            </div>

            {/* Wynik - Edytowalny tylko dla wykonawcy */}
            <div className="flex flex-col gap-2">
              <Label>Wynik</Label>
              {isExecutor ? (
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Textarea {...field} placeholder="Wpisz wynik prac..." className="bg-gray-50/50 min-h-[100px]" />
                  )}
                />
              ) : (
                <Textarea 
                  disabled
                  value={"Brak wpisanego wyniku"} 
                  className="bg-gray-100 text-gray-500 min-h-[100px]" 
                />
              )}
              {isExecutor && actionData?.fieldErrors?.result && (
                <span className="text-xs text-destructive">{actionData.fieldErrors.result[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Przyciski Akcji */}
        <div className="flex items-center gap-3 self-start">
          {isExecutor ? (
            <>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800 px-8">
                Zapisz
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Anuluj
              </Button>
            </>
          ) : (
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Powrót
            </Button>
          )}
        </div>
      </Form>
    </PageLayout>
  );
}