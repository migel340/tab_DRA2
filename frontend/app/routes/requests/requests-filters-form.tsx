import { Form, useSubmit } from "react-router";
import { RequestsFilterSchema, type RequestsFilterParams } from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import SearchBar from "~/components/SearchBar";

export function RequestsFiltersForm({
  initialValues,
}: {
  initialValues: RequestsFilterParams;
}) {
  const submit = useSubmit();

  const { watch, handleSubmit, control, register } = useForm({
    resolver: zodResolver(RequestsFilterSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: RequestsFilterParams) {
    submit(data, { replace: true });
  }

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      handleSubmit(onSubmit)();
    });
    return () => unsubscribe();
  }, [watch, handleSubmit]);

  return (
    <Form method="get" action="/requests" id="filter-form" className="flex flex-col gap-4 w-full">
      {/* Górny rząd: Selektory */}
      <div className="flex flex-wrap gap-3">
        <Controller
          name="manager"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[200px] bg-gray-50 border-gray-100 shadow-none">
                <SelectValue placeholder="Wybierz Managera" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszyscy</SelectItem>
                <SelectItem value="jan">Jan Kowalski</SelectItem>
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
          <SearchBar field={field} fieldState={fieldState} placeholder="Wyszukaj zgłoszenie..." />
        )}
      />
    </Form>
  );
}