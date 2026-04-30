import { Form, useSubmit } from "react-router";
import { FilterSchema, type FilterValues } from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchBar from "~/components/SearchBar";

export function PersonelFiltersForm({
  initialValues,
}: {
  initialValues: FilterValues;
}) {
  const submit = useSubmit();

  const { watch, handleSubmit, control, register } = useForm({
    resolver: zodResolver(FilterSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: FilterValues) {
    submit(data, { replace: true });
  }

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      handleSubmit(onSubmit)();
    });
    return () => unsubscribe();
  }, [watch, handleSubmit]);

  return (
    <Form method="get" action="/personel" id="filter-form">
      <Controller
        name="q"
        control={control}
        render={({ field, fieldState }) => (
          <SearchBar field={field} fieldState={fieldState} />
        )}
      />
      <input type="hidden" {...register("sortBy")} />
      <input type="hidden" {...register("order")} />
    </Form>
  );
}
