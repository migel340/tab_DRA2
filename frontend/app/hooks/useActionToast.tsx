import { useEffect } from "react";
import { toast } from "sonner";

interface ActionResponse {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
}

export const useActionToast = (
  actionData: ActionResponse | undefined,
  successMessage = "Zapisano zmiany!",
) => {
  useEffect(() => {
    if (!actionData) return;

    if (actionData.success) {
      toast.success(successMessage);
    } else if (actionData.message) {
      toast.error(actionData.message);
    } else if (actionData.errors) {
      const firstField = Object.keys(actionData.errors)[0];
      const errorMsg = actionData.errors[firstField]?.[0];
      toast.error(`${firstField}: ${errorMsg}`);
    }
  }, [actionData, successMessage]);
};
