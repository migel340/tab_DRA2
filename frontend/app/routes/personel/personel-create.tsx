import PageLayout from "~/layouts/PageLayout";
import PersonelForm, { type PersonelFormValues } from "./personel-form";
import { useEffect } from "react";
import { useNavigate, useSubmit } from "react-router";
import type { Route } from "./+types/personel-create";
import { getUser } from "~/lib/auth";
import z from "zod";
import { personelService } from "./personel-service";
import { PersonelCreateApiSchema } from "~/types/personel";
import { useActionToast } from "~/hooks/useActionToast";

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
      errors: z.flattenError(result.error).fieldErrors,
      status: 400,
    };
  }

  const createdPersonel = await personelService.createPersonel(result.data);

  return {
    success: true,
    id: createdPersonel.id,
  };
}

export default function PersonelCreatePage({
  actionData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  const submit = useSubmit();
  useActionToast(actionData, "Pomyślnie utworzono użytkownika!");

  useEffect(() => {
    if (actionData?.success && actionData.id) {
      navigate(`/personel/${actionData.id}`, { replace: true });
    }
  }, [actionData, navigate]);

  const onSubmit = (data: PersonelFormValues) => {
    submit(data, {
      method: "POST",
    });
  };

  return (
    <PageLayout title="Dodaj nowego użytkownika">
      <PersonelForm onSubmit={onSubmit} />
    </PageLayout>
  );
}
