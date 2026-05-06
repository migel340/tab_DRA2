import { Form, useSubmit } from "react-router";
import { PersonelFilterSchema, type PersonelFilterParams } from "./schema";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchBar from "~/components/SearchBar";

export function PersonelFiltersForm({
  initialValues,
}: {
  initialValues: PersonelFilterParams;
}) {
  const submit = useSubmit();

  const { watch, handleSubmit, control, register } = useForm({
    resolver: zodResolver(PersonelFilterSchema),
    defaultValues: initialValues,
  });

  function onSubmit(data: PersonelFilterParams) {
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
      <input type="hidden" {...register("orderBy")} />
      <input type="hidden" {...register("sort")} />
    </Form>
  );
}
