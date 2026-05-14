import { Form, useSubmit } from "react-router";
import { PersonelFilterSchema, type PersonelFilterParams } from "./schema";
import { useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SearchBar from "~/components/SearchBar";
import { InputGroupButton } from "~/components/ui/input-group";
import { X } from "lucide-react";

export function PersonelFiltersForm({
  initialValues,
}: {
  initialValues: PersonelFilterParams;
}) {
  const submit = useSubmit();

  const { handleSubmit, control, register, setValue } = useForm({
    resolver: zodResolver(PersonelFilterSchema),
    defaultValues: initialValues,
  });

  const searchQuery = useWatch({ control, name: "q" });

  function onSubmit(data: PersonelFilterParams) {
    submit(data, { replace: true });
  }
  useEffect(() => {
    if (searchQuery?.trim() === "") {
      handleSubmit(onSubmit)();
    }
  }, [searchQuery, handleSubmit]);

  return (
    <Form
      method="get"
      action="/personel"
      id="filter-form"
      onSubmit={handleSubmit(onSubmit)}
    >
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
