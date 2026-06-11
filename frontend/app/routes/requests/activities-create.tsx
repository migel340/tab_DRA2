import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  useNavigate,
  useSubmit,
  useActionData,
  type ActionFunctionArgs,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import PageLayout from "~/layouts/PageLayout";
import { BaseSelect } from "~/components/Select";
import {
  CreateActivitySchema,
  ServerCreateActivitySchema,
  type CreateActivityFormInputValues,
  type CreateActivityFormValues,
} from "../activities/schema";
import type { Route } from "./+types/activities-create";
import { activitiesService } from "../activities/activities-service";
import { personelService } from "../personel/personel-service";
import z from "zod";
import { useEffect } from "react";
import { useActionToast } from "~/hooks/useActionToast";
import InputField from "~/components/InputField";

export async function loader({ request }: Route.LoaderArgs) {
  const activitesTypes = await activitiesService.getAllTypes(request);

  const executors = await personelService.fetchLookup(request, "STAFF");

  executors.push({ id: -1, name: "brak" });

  return { activitesTypes, executors };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const payload = await request.json();
  const parsed = CreateActivitySchema.safeParse(payload);

  if (!parsed.success) {
    return {
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      success: false,
    };
  }

  const parsedData = ServerCreateActivitySchema.safeParse({
    ...parsed.data,
    requestId: params.id,
    status: "REGISTERED",
  });

  if (!parsedData.success) {
    return {
      fieldErrors: z.flattenError(parsedData.error).fieldErrors,
      success: false,
    };
  }

  try {
    const activity = await activitiesService.create(parsedData.data, request);

    return { success: true, id: activity.id };
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
  breadcrumb: () => "nowa",
};

export default function ActivityCreatePage({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { activitesTypes, executors } = loaderData;

  const submit = useSubmit();
  const navigate = useNavigate();

  const actionData = useActionData<typeof action>();

  useActionToast(actionData, "Pomyślnie dodano aktwność!");

  useEffect(() => {
    if (actionData?.success && actionData.id) {
      navigate(`/requests/${params.id}/activities/${actionData.id}`, {
        replace: true,
      });
    }
  }, [actionData, navigate, params.id]);

  const { handleSubmit, control } = useForm<
    CreateActivityFormInputValues,
    any,
    CreateActivityFormValues
  >({
    resolver: zodResolver(CreateActivitySchema),
    defaultValues: {
      type: activitesTypes[0],
      executor: {
        id: -1,
        name: "brak",
      },
      description: "",
      seqNo: "",
    },
  });

  const onSubmit = (data: CreateActivityFormValues) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Dodaj nową aktywność">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Opis</Label>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Textarea
                      id="description"
                      {...field}
                      className="bg-gray-50/50 min-h-[120px]"
                    />

                    {actionData?.fieldErrors?.description && (
                      <span className="text-xs text-destructive">
                        {actionData.fieldErrors.description[0]}
                      </span>
                    )}

                    {fieldState.error?.message && (
                      <span className="text-xs text-destructive">
                        {fieldState.error?.message}
                      </span>
                    )}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start">
          <Button
            type="submit"
            className="bg-black text-white hover:bg-gray-800"
          >
            Stwórz
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="bg-gray-100 text-black hover:bg-gray-200"
            onClick={() => navigate(`/requests/${params.id}`)}
          >
            Anuluj
          </Button>
        </div>
      </Form>
    </PageLayout>
  );
}
