import { Form, useSubmit } from "react-router";
import { ActivitiesFilterSchema, type ActivitiesFilterParams } from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import SearchBar from "~/components/SearchBar";

export function ActivitiesFiltersForm({
  initialValues,
}: {
  initialValues: ActivitiesFilterParams;
}) {
  const submit = useSubmit();

  const { watch, handleSubmit, control, register } = useForm({
    resolver: zodResolver(ActivitiesFilterSchema),
    defaultValues: {
      ...initialValues,
      q: initialValues.q === "undefined" ? "" : (initialValues.q ?? ""),
    },
  });

  function onSubmit(data: ActivitiesFilterParams) {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined && v !== "" && v !== "undefined")
    );
    submit(cleanData as any, { replace: true });
  }

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      handleSubmit(onSubmit)();
    });
    return () => unsubscribe();
  }, [watch, handleSubmit]);

  return (
    <Form method="get" action="/activities" id="filter-form" className="flex flex-col gap-4 w-full">
      {/* Górny rząd: Selektory */}
      <div className="flex flex-wrap gap-3">
        <Controller
          name="executor"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[200px] bg-gray-50 border-gray-100 shadow-none">
                <SelectValue placeholder="Wybierz Wykonawcę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy</SelectItem>
                <SelectItem value="Piotr Wiśniewski">Piotr Wiśniewski</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[200px] bg-gray-50 border-gray-100 shadow-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="active">Aktywne</SelectItem>
                <SelectItem value="FIN">Zakończone</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Controller
          name="dateRange"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[200px] bg-gray-50 border-gray-100 shadow-none">
                <SelectValue placeholder="Wybierz Datę" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Kiedykolwiek</SelectItem>
                <SelectItem value="last_week">Ostatni tydzień</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Dolny rząd: Searchbar */}
      <Controller
        name="q"
        control={control}
        render={({ field, fieldState }) => (
          <SearchBar field={field} fieldState={fieldState} placeholder="Wyszukaj aktywność..." />
        )}
      />
    </Form>
  );
}