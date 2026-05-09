import React from "react";
import { useNavigate, useLocation } from "react-router";

type Props = {
  title: string;
  field: string;
  currentSort?: string | null;
  currentOrder?: "asc" | "desc" | null;
  onSortChange?: (field: string, order: "asc" | "desc") => void;
};

export default function SortableHeader({
  title,
  field,
  currentSort,
  currentOrder,
  onSortChange,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  function toggle() {
    const isCurrent = currentSort === field;
    const nextOrder: "asc" | "desc" =
      isCurrent && currentOrder === "asc" ? "desc" : "asc";

    // Prefer a provided callback (useTable helper). Otherwise update URL directly.
    if (onSortChange) {
      onSortChange(field, nextOrder);
      return;
    }

    const search = new URLSearchParams(location.search);
    search.set("sortBy", field);
    search.set("order", nextOrder);

    navigate(location.pathname + "?" + search.toString(), { replace: false });
  }

  const indicator =
    currentSort === field ? (currentOrder === "asc" ? "↑" : "↓") : "";

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-1 text-sm font-medium"
    >
      <span>{title}</span>
      <span aria-hidden={true} className="opacity-60">
        {indicator}
      </span>
    </button>
  );
}
