import type {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";
import { Input } from "./ui/input";
import { BaseField } from "./BaseField";
import type { ComponentProps } from "react";

interface InputFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> extends ComponentProps<typeof Input> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  label?: string;
}

export default function InputField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  field,
  fieldState,
  label,
  placeholder,
  ...inputProps
}: InputFieldProps<TFieldValues, TName>) {
  return (
    <BaseField
      label={label}
      error={fieldState.error?.message}
      htmlFor={field.name}
    >
      <Input
        {...field}
        {...inputProps}
        name={field.name}
        aria-invalid={fieldState.invalid}
        placeholder={placeholder}
      />
    </BaseField>
  );
}
