import PageLayout from "~/layouts/PageLayout";
import PersonelForm, { type PersonelFormValues } from "./personel-form";
import { redirect, useSubmit } from "react-router";
import type { Route } from "./+types/personel-create";
import { getUser } from "~/lib/auth";
import z from "zod";
import { personelService } from "./personel-service";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { PersonelCreateApiSchema } from "~/types/personel";

export const handle = {
  breadcrumb: () => "nowy",
};

export async function action({ request }: Route.ActionArgs) {
  const user = getUser();
  if (!user) {
    return { message: "Unauthorized", status: 401 };
  }

  if (user.role !== "ADMIN") {
    return {
      success: false,
      message: "Forbidden: You don't have permission",
      status: 403,
    };
  }

  const formData = await request.formData();
  const object = Object.fromEntries(formData.entries());

  const result = PersonelCreateApiSchema.safeParse(object);

  if (!result.success) {
    return {
      success: false,
      errors: z.treeifyError(result.error),
      status: 400,
    };
  }

  const createdPersonel = await personelService.createPersonel(result.data);
  throw redirect(`/personel/${createdPersonel.id}`, {
    headers: { "X-Remix-Replace": "true" },
  });
}

export default function PersonelCreatePage({
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit();

  const onSubmit = (data: PersonelFormValues) => {
    submit(data, {
      method: "POST",
    });
  };

  return (
    <PageLayout title="Dodaj nowego użytkownika">
      {actionData && !actionData.success && (
        <Alert variant="destructive" className="mb-5">
          <AlertCircleIcon />
          <AlertTitle>Wystąpił Błąd</AlertTitle>
          <AlertDescription>
            {actionData.message && actionData.message}
          </AlertDescription>
        </Alert>
      )}
      <PersonelForm onSubmit={onSubmit} />
    </PageLayout>
  );
}
