import { useSubmit } from "react-router";
import {
  ActivitiesFilterSchema,
  type ActivitiesFilterParamsInput,
  type ActivitiesFilterParamsOutput,
} from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns/format";
import SearchBar from "~/components/SearchBar";
import { buildUrl } from "~/lib/utils";
import type { DateRange } from "react-day-picker";
import { BaseField } from "~/components/BaseField";
import { DatePickerWithRange } from "~/components/RangePicker";
import { BaseSelect, RepairStatusSelect } from "~/components/Select";
import type { PersonelLookup } from "~/types/personel";

export function ActivitiesFiltersForm({
  initialValues,
  excutors,
}: {
  initialValues: ActivitiesFilterParamsInput;
  excutors: PersonelLookup[];
}) {
  const submit = useSubmit();

  const { watch, setValue, handleSubmit, control } = useForm<
    ActivitiesFilterParamsInput,
    any,
    ActivitiesFilterParamsOutput
  >({
    resolver: zodResolver(ActivitiesFilterSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      handleSubmit(onSubmit)();
    });
    return () => unsubscribe();
  }, [watch, handleSubmit]);

  function onSubmit(data: ActivitiesFilterParamsOutput) {
    const url = buildUrl("/activities", data);
    submit(data, { action: url, replace: true });
  }

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
          name="executor"
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
              options={excutors}
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
            placeholder="Wyszukaj aktywność..."
          />
        )}
      />
    </form>
  );
}
