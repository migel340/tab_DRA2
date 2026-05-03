import React from "react";
import { useLocation, useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

export function SortableHeaderExample() {
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const params = new URLSearchParams(search);
  const sort = params.get("sort") || "name";
  const dir = params.get("dir") || "asc";
  const [announce, setAnnounce] = React.useState("");

  function setSort(next: string) {
    const nextDir = next === sort && dir === "asc" ? "desc" : "asc";
    params.set("sort", next);
    params.set("dir", nextDir);
    navigate(`${pathname}?${params.toString()}`);
    setAnnounce(
      `${next} sorted ${nextDir === "asc" ? "ascending" : "descending"}`,
    );
    window.setTimeout(() => setAnnounce(""), 1000);
  }

  function onKeyDown(e: React.KeyboardEvent, key: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSort(key);
    }
  }

  return (
    <div>
      <div aria-live="polite" className={cn("sr-only")}>
        {announce}
      </div>
      <Button
        variant="ghost"
        role="columnheader"
        aria-sort={
          sort === "name"
            ? dir === "asc"
              ? "ascending"
              : "descending"
            : "none"
        }
        aria-label={`Sort by name ${sort === "name" && dir === "asc" ? "descending" : "ascending"}`}
        onClick={() => setSort("name")}
        onKeyDown={(e) => onKeyDown(e, "name")}
        className={cn("flex items-center gap-2")}
      >
        Name
      </Button>
    </div>
  );
}
