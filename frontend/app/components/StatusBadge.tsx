import * as React from "react";
import { Badge } from "./ui/badge";
import type { RepairStatus } from "~/types/status";

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  status: RepairStatus;
}

const statusConfig: Record<RepairStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "Oczekujący",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    },
    IN_PROGRESS: {
      label: "W realizacji",
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    },
    COMPLETED: {
      label: "Zakończony",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
    },
    REJECTED: {
      label: "Odrzucony",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
    },
  };

export function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: "Nieznany",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  return (
    <Badge {...props} className={config.className}>
      {config.label}
    </Badge>
  );
}
