import * as React from "react";
import { cn } from "~/lib/utils";

export type RepairStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: RepairStatus;
  label?: string; 
}

const statusConfig: Record<RepairStatus, { label: string; className: string }> = {
  PENDING: {
    label: "Oczekujący",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
  },
  IN_PROGRESS: {
    label: "W realizacji",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
  },
  COMPLETED: {
    label: "Zakończony",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
  },
  REJECTED: {
    label: "Odrzucony",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
  },
};

export function StatusBadge({ status, className, label, ...props }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: "Nieznany",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300", // Fallback style
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border border-transparent",
        config.className,
        className
      )}
      {...props}
    >
      {label || config.label}
    </div>
  );
}