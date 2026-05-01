import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";
import { ConfirmButton } from "./ConfirmButton";

interface DeleteButtonProps extends React.ComponentProps<typeof Button> {
  onConfirm: () => void;
  confirmTitle?: string;
  confirmDescription?: string;
}

export default function DeleteButton({
  className,
  size = "default",
  children,
  onConfirm,
  confirmTitle,
  confirmDescription,
  ...props
}: DeleteButtonProps) {
  return (
    <ConfirmButton
      onConfirm={onConfirm}
      title={confirmTitle || "Usuwanie wpisu"}
      description={
        confirmDescription ||
        "Czy na pewno chcesz usunąć ten element? Operacja jest nieodwracalna."
      }
      variant="destructive"
      confirmText="Usuń"
      data-slot="alert-action"
    >
      <Button
        variant="destructive"
        size={size}
        className={cn("rounded-sm gap-2", className)}
        {...props}
        onClick={(e) => {
          e.stopPropagation();
          props.onClick?.(e);
        }}
      >
        <Trash2 className="h-4 w-4" />
        {!["icon", "icon-sm", "icon-xs"].includes(size as string) && (
          <span>{children || "Usuń"}</span>
        )}
      </Button>
    </ConfirmButton>
  );
}
