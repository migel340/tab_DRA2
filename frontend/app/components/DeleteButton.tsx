import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface DeleteButtonProps extends React.ComponentProps<typeof Button> {
  confirmMessage?: string;
}

export default function DeleteButton({
  className,
  size = "default",
  children,
  ...props
}: DeleteButtonProps) {
  return (
    <Button
      variant="destructive"
      size={size}
      className={cn("rounded-sm", className)}
      {...props}
    >
      <Trash2 />
      {size !== "icon" && size !== "icon-sm" && size !== "icon-xs" && (
        <span>{children || "Usuń"}</span>
      )}
    </Button>
  );
}
