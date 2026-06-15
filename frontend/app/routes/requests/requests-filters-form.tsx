import { useSubmit } from "react-router";
import {
  RequestsFilterSchema,
  type RequestsFilterParamsInput,
  type RequestsFilterParamsOutput,
} from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchBar from "~/components/SearchBar";
import { DatePickerWithRange } from "~/components/RangePicker";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns/format";
import { buildUrl } from "~/lib/utils";
import { BaseSelect, RepairStatusSelect } from "~/components/Select";
import { type PersonelLookup } from "~/types/personel";
import { BaseField } from "~/components/BaseField";

export function RequestsFiltersForm({
  initialValues,
  managers = [],
}: {
  initialValues: RequestsFilterParamsOutput;
  managers?: PersonelLookup[];
}) {
  const submit = useSubmit();

  const { watch, handleSubmit, control, setValue } = useForm<
    RequestsFilterParamsInput,
    any,
    RequestsFilterParamsOutput
  >({
    resolver: zodResolver(RequestsFilterSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: RequestsFilterParamsOutput) {
    const url = buildUrl("/requests", data);
    console.log(url);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Controller
          name="manager"
          control={control}
          render={({ field, fieldState }) => (
            <BaseSelect
              showAllOption
              field={field}
              fieldState={fieldState}
              label="Wykonawca"
              placeholder="Wybierz wykonawcę"
              getOptionKey={({ id }) => id}
              getOptionValue={({ id }) => id}
              onValueChange={({ id }) => id}
              options={managers}
              renderItem={({ name }) => name}
              //@ts-ignore
              getValueToSave={({ id }) => id.toString()}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <RepairStatusSelect
              label="Status"
              field={field}
              fieldState={fieldState}
            />
          )}
        />

        <BaseField label="Daty">
          <DatePickerWithRange
            value={selectedDateRange}
            onChange={handleDateChange}
          />
        </BaseField>
      </div>

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
