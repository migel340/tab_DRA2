import { Form, useSubmit } from "react-router";
import {
  RequestsFilterSchema,
  type RequestsFilterParamsInput,
  type RequestsFilterParamsOutput,
} from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import SearchBar from "~/components/SearchBar";
import { DatePickerWithRange } from "~/components/RangePicker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns/format";
import { buildUrl } from "~/lib/utils";

export function RequestsFiltersForm({
  initialValues,
  loggedUserId,
  managers = [],
}: {
  initialValues: RequestsFilterParamsInput;
  loggedUserId: number;
  managers?: Array<{ id: number; firstName: string; surname: string }>;
}) {
  const submit = useSubmit();

  const {
    watch,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<RequestsFilterParamsInput, any, RequestsFilterParamsOutput>({
    resolver: zodResolver(RequestsFilterSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: RequestsFilterParamsOutput) {
    const url = buildUrl("/requests", data);
    submit(data, { action: url, replace: true });
  }

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      handleSubmit(onSubmit)();
    });
    return () => unsubscribe();
  }, [watch, handleSubmit]);

  const dateFrom = watch("dateFrom");
  const dateTo = watch("dateTo");

  const selectedDateRange: DateRange | undefined = {
    from: dateFrom ? new Date(dateFrom) : undefined,
    to: dateTo ? new Date(dateTo) : undefined,
  };

  const handleDateChange = (range: DateRange | undefined) => {
    setValue(
      "dateFrom",
      range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
    );
    setValue("dateTo", range?.to ? format(range.to, "yyyy-MM-dd") : undefined);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full"
    >
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
                <SelectItem value={loggedUserId.toString()}>
                  Moje zgłoszenia
                </SelectItem>
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
                <SelectItem value="REGISTERED">Zarejestrowane</SelectItem>
                <SelectItem value="IN_PROGRESS">W trakcie</SelectItem>
                <SelectItem value="FINISHED">Zakończone</SelectItem>
                <SelectItem value="CANCELLED">Anulowane</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <DatePickerWithRange
          value={selectedDateRange}
          onChange={handleDateChange}
        />
      </div>

      {/* Dolny rząd: Searchbar */}
      <Controller
        name="q"
        control={control}
        render={({ field, fieldState }) => (
          <SearchBar
            field={field}
            fieldState={fieldState}
            placeholder="Wyszukaj zgłoszenie..."
          />
        )}
      />
    </form>
  );
}
