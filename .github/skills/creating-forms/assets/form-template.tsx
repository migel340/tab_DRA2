import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmit } from "react-router-dom";
import { z } from "zod";

// ~ imports to repo examples
import { PersonelRoleSelect } from "~/routes/personel/personel-form";
import { PersonelCreateSchema } from "~/routes/personel/schema";

type FormValues = z.infer<typeof PersonelCreateSchema>;

export default function PersonelFormExample() {
  const submit = useSubmit();
  const { control, handleSubmit, register, formState } = useForm<FormValues>({
    resolver: zodResolver(PersonelCreateSchema),
    defaultValues: { name: "", role: undefined },
  });

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("role", String(data.role));
    submit(formData, { method: "post" });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Name</label>
      <input {...register("name")} />

      <label>Role</label>
      <Controller
        control={control}
        name="role"
        render={({ field }) => (
          <PersonelRoleSelect value={field.value} onChange={field.onChange} />
        )}
      />

      <button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
