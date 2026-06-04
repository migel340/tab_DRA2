import { Form, useSubmit } from "react-router";
import { RequestsFilterSchema, type RequestsFilterParams } from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import SearchBar from "~/components/SearchBar";
import { DatePickerWithRange } from "~/components/RangePicker";

export function RequestsFiltersForm({
  initialValues,
<<<<<<< HEAD
  currentUser,
}: {
  initialValues: RequestsFilterParams;
  currentUser: any;
=======
  loggedUserId,
  managers = [],
}: {
  initialValues: RequestsFilterParams;
  loggedUserId: number;
  managers?: Array<{ id: number; firstName: string; surname: string }>;
>>>>>>> 2476a20 (filtering requests)
}) {
  const submit = useSubmit();

  const { watch, handleSubmit, control, register} = useForm({
    resolver: zodResolver(RequestsFilterSchema),
    defaultValues: {
      ...initialValues,
      q: initialValues.q === "undefined" ? "" : (initialValues.q ?? ""),
    },
  });

  function onSubmit(data: RequestsFilterParams) {
    // Usuwamy puste wartości i "undefined", żeby nie zaśmiecały URL (np. q=undefined)
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
<<<<<<< HEAD
                {currentUser && (
                  <SelectItem value={currentUser.username}>{currentUser.firstName} {currentUser.surname}</SelectItem>
                )}
=======
                <SelectItem value={loggedUserId.toString()}>Moje zgłoszenia</SelectItem>
>>>>>>> 2476a20 (filtering requests)
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
<<<<<<< HEAD
                <SelectItem value="OPN">OPEN</SelectItem>
                <SelectItem value="PRO">PROGRESS</SelectItem>
                <SelectItem value="FIN">FINISH</SelectItem>
                <SelectItem value="CAN">CANCELED</SelectItem>
=======
                <SelectItem value="REGISTERED">Zarejestrowane</SelectItem>
                <SelectItem value="IN_PROGRESS">W trakcie</SelectItem>
                <SelectItem value="FINISHED">Zakończone</SelectItem>
                <SelectItem value="CANCELLED">Anulowane</SelectItem>
>>>>>>> 2476a20 (filtering requests)
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
                <SelectItem value="today">Dzisiaj</SelectItem>
                <SelectItem value="last_week">Ostatni tydzień</SelectItem>
                <SelectItem value="last_month">Ostatni miesiąc</SelectItem>
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