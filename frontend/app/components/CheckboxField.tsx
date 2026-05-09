import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Checkbox } from "./ui/checkbox";
import { BaseField } from "./BaseField";
import type { ComponentProps } from "react";

interface CheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> extends ComponentProps<typeof Checkbox> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  label: string;
}

export default function CheckboxField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldState,
  label,
  ...checkboxProps
}: CheckboxFieldProps<TFieldValues, TName>) {
  return (
    <BaseField
      label={label}
      error={fieldState.error?.message}
      htmlFor={field.name}
      className="w-fit"
    >
      <Checkbox
        {...field}
        {...checkboxProps}
        checked={field.value}
        onCheckedChange={field.onChange}
        aria-invalid={fieldState.invalid}
      />
    </BaseField>
  );
}
