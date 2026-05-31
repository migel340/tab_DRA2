import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Form, useNavigate, useSubmit, useActionData, type ActionFunctionArgs, redirect } from "react-router";
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
import z from "zod";
import { NewRequestFormSchema, type NewRequestFormData } from "./schema";
import { MOCK_CLIENTS, MOCK_DEVICES } from "~/mocks/requests";
import { requestsService } from "./requests-service";
import { requireManager } from "~/lib/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  await requireManager(request);

  const payload = await request.json();
  const parsed = NewRequestFormSchema.safeParse(payload);
  
  if (!parsed.success) {
    return { success: false, fieldErrors: z.flattenError(parsed.error).fieldErrors, status: 400,};
  }

  try {
    await requestsService.createRequest(parsed.data, request);
    return redirect("/requests");
  } catch (error) {
    return { success: false, formError: "Wystąpił błąd podczas tworzenia zgłoszenia." };
  }

}

export const handle = {
  breadcrumb: () => "nowe",
};

export default function RequestCreatePage() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const actionData = useActionData<typeof action>();

  const { handleSubmit, control } = useForm<NewRequestFormData>({
    resolver: zodResolver(NewRequestFormSchema),
    defaultValues: {
      clientId: "",
      deviceId: "",
      description: "",
    },
  });

  const onSubmit = (data: NewRequestFormData) => {
    submit(data, { method: "post", encType: "application/json" });
  };

  return (
    <PageLayout title="Dodaj nowe zgłoszenie">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-2">Informacje</h2>
          <Separator className="mb-6" />

          <div className="flex flex-col gap-6">
            {/* First Row: Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label htmlFor="clientId">Klient</Label>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="clientId" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz klienta" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CLIENTS.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {actionData?.fieldErrors?.clientId && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.clientId[0]}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="deviceId">Urządzenie</Label>
                <Controller
                  name="deviceId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="deviceId" className="bg-gray-50/50">
                        <SelectValue placeholder="Wybierz urządzenie" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_DEVICES.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {actionData?.fieldErrors?.deviceId && (
                  <span className="text-xs text-destructive">{actionData.fieldErrors.deviceId[0]}</span>
                )}
              </div>
            </div>

            {/* Second Row: Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Opis</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Wprowadź szczegółowy opis zgłoszenia..."
                    className="bg-gray-50/50 min-h-[150px]"
                  />
                )}
              />
              {actionData?.fieldErrors?.description && (
                <span className="text-xs text-destructive">{actionData.fieldErrors.description[0]}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start">
          <Button type="submit" className="bg-black text-white">
            Stwórz
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Anuluj
          </Button>
        </div>
      </Form>
    </PageLayout>
  );
}