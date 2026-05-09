import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "react-router";
import { z } from "zod";
import { BaseTableParamsSchema } from "~/types/table";

// Extend the base params schema with route-specific filters
const FiltersSchema = BaseTableParamsSchema.extend({
  // Example filter
  name: z.string().optional(),
});

type Filters = z.infer<typeof FiltersSchema>;

export default function FiltersForm({
  defaultValues,
}: {
  defaultValues?: Partial<Filters>;
}) {
  const submit = useSubmit();
  const form = useForm<Filters>({
    resolver: zodResolver(FiltersSchema),
    defaultValues: defaultValues as Partial<Filters>,
  });

  function onSubmit(values: Filters) {
    // Convert values to search params and submit (updates URL without full page reload)
    const params = new URLSearchParams();
    if (values.page) params.set("page", String(values.page));
    if (values.perPage) params.set("perPage", String(values.perPage));
    if (values.sortBy) params.set("sortBy", values.sortBy);
    if (values.order) params.set("order", values.order);
    if (values.name) params.set("name", values.name);

    submit(params, { method: "get" });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          {...form.register("name")}
          className="mt-1 block w-full rounded-md border"
        />
      </div>

      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Apply
        </button>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            form.reset();
            submit(new URLSearchParams(), { method: "get" });
          }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}
