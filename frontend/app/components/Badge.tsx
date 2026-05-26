import * as React from "react";
import { Badge } from "./ui/badge";
import { cn } from "~/lib/utils";
import type { AccountStatus, RepairStatus } from "~/types/status";

export type BadgeConfig<T extends string> = Record<
  T,
  { label: string; className: string }
>;

interface BaseBadgeProps<T extends string> extends React.ComponentProps<
  typeof Badge
> {
  status: T;
  config: BadgeConfig<T>;
}

export function BaseBadge<T extends string>({
  status,
  config,
  className,
  ...props
}: BaseBadgeProps<T>) {
  const item = config[status];

  return (
    <Badge
      {...props}
      className={cn(
        item?.className,
        "font-medium shadow-none border-transparent",
        className,
      )}
    >
      {item?.label || status}
    </Badge>
  );
}

const repairConfig: BadgeConfig<RepairStatus> = {
  OPN: {
    label: "OPEN",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
  },
  PRO: {
    label: "PROGRESS",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
  },
  FIN: {
    label: "FINISH",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
  },
  CAN: {
    label: "CANCELED",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
  },
};

const accountConfig: BadgeConfig<AccountStatus> = {
  ACTIVE: {
    label: "Aktywny",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
  },
  INACTIVE: {
    label: "Nieaktywny",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  },
};

export function RepairStatusBadge(
  props: Omit<BaseBadgeProps<RepairStatus>, "config">,
) {
  return <BaseBadge {...props} config={repairConfig} />;
}

export function AccountStatusBadge(
  props: Omit<BaseBadgeProps<AccountStatus>, "config">,
) {
  return <BaseBadge {...props} config={accountConfig} />;
}
