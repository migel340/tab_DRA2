import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  useNavigate,
  useSubmit,
  useActionData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import PageLayout from "~/layouts/PageLayout";
import { BaseSelect, RepairStatusSelect } from "~/components/Select";
import {
  EditActivityFormSchema,
  ServerEditActivityFormSchema,
  type EditActivityFormData,
  type EditActivityInputFormData,
} from "../activities/schema";
import { activitiesService } from "../activities/activities-service";
import z, { success } from "zod";
import { personelService } from "../personel/personel-service";
import type { Route } from "./+types/activities-edit";
import InputField from "~/components/InputField";
import { useActionToast } from "~/hooks/useActionToast";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { activityId } = params;

  const paresdId = z.coerce.number().safeParse(activityId);
  if (!paresdId.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const activity = await activitiesService.getById(paresdId.data, request);

  const activitesTypes = await activitiesService.getAllTypes(request);

  const executors = await personelService.fetchLookup(request, "STAFF");

  executors.push({ id: -1, name: "brak" });

  return { activity, activitesTypes, executors };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { activityId, id } = params;

  const paresdId = z.coerce.number().safeParse(activityId);
  if (!paresdId.success) {
    throw new Response("Invalid ID", { status: 400 });
  }

  const payload = await request.json();
  const parsed = ServerEditActivityFormSchema.safeParse(payload);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, success: false };
  }

  try {
    await activitiesService.update(paresdId.data, parsed.data, request);
    return { success: true };
  } catch (error) {
    return {
      success: false as const,
      serverError:
        error instanceof Error
          ? error.message
          : "Wystąpił nieoczekiwany błąd serwera.",
    };
  }
}

export const handle = {
  breadcrumb: () => "szczegóły",
};

export default function ActivityEditPage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { activity, activitesTypes, executors } = loaderData;

  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();
  const { id } = params;

  useActionToast(actionData, "Pomyślnie dodano aktwność!");

  const { handleSubmit, control } = useForm<
    EditActivityInputFormData,
    any,
    EditActivityFormData
  >({
    resolver: zodResolver(EditActivityFormSchema),
    defaultValues: {
      type: activity.type,
      executor: activity.executor ?? { id: -1, name: "brak" },
      status: activity.status,
      description: activity.description,
      result: activity.result ?? "",
      seqNo: activity.seqNo,
    },
  });

  const onSubmit = (data: EditActivityFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Edytuj aktywność">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="seqNo"
                control={control}
                render={({ field, fieldState }) => (
                  <InputField
                    label="Number Sekwencyjny"
                    placeholder="np. 1"
                    field={field}
                    type="number"
                    fieldState={fieldState}
                  />
                )}
              />

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

              <Controller
                name="type"
                control={control}
                render={({ field, fieldState }) => (
                  <BaseSelect
                    field={field}
                    fieldState={fieldState}
                    label="Typ"
                    placeholder="Wybierz typ"
                    getOptionKey={({ id }) => id}
                    getOptionValue={({ actType }) => actType}
                    options={activitesTypes}
                    renderItem={({ actType }) => actType}
                  />
                )}
              />

              <Controller
                name="executor"
                control={control}
                render={({ field, fieldState }) => (
                  <BaseSelect
                    field={field}
                    fieldState={fieldState}
                    label="Wykonawca"
                    placeholder="Wybierz wykonawcę"
                    getOptionKey={({ id }) => id}
                    getOptionValue={({ name }) => name}
                    options={executors}
                    renderItem={({ name }) => name}
                  />
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Opis</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    className="bg-gray-50/50 min-h-[100px]"
                  />
                )}
              />
              {actionData?.fieldErrors?.description && (
                <span className="text-xs text-destructive">
                  {actionData.fieldErrors.description[0]}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="result">Wynik</Label>
              <Controller
                name="result"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="result"
                    {...field}
                    value={field.value ?? ""}
                    className="bg-gray-50/50 min-h-[100px]"
                  />
                )}
              />
              {actionData?.fieldErrors?.result && (
                <span className="text-xs text-destructive">
                  {actionData.fieldErrors.result[0]}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start">
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
            onClick={() => navigate(`/requests/${id}`)}
          >
            Anuluj
          </Button>
        </div>
      </Form>
    </PageLayout>
  );
}
