import type { Route } from "./+types/personel-delete";
import z from "zod";
import { personelService } from "./personel-service";
import { requireAdmin } from "~/lib/auth.server";

export async function action({ request, params }: Route.ActionArgs) {
  await requireAdmin(request);

  if (request.method !== "DELETE") {
    return { message: "Method not allowed", status: 405 };
  }

  const { id } = params;
  const result = z.coerce.number().safeParse(id);
  if (!result.success) {
    return { message: "Invalid ID", status: 400 };
  }

  try {
    await personelService.deletePersonel(result.data, request);
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      message: "Server error during deletion",
      success: false,
      status: 500,
    };
  }
}

export default function PersonelDeleteRoute() {
  return null;
}
