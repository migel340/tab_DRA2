import type { ReactNode } from "react";
import { Controller, type Control, type ControllerRenderProps, type ControllerFieldState, type FieldValues, type Path } from "react-hook-form";
import { AccountStatusSchema, RepairStatusSchema } from "~/types/status";
import {
  DeviceTypeSchema,
  DEVICE_TYPE_LABELS,
  type DeviceType,
} from "~/types/device";
import { BaseField } from "./BaseField";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { AccountStatusBadge, RepairStatusBadge } from "./Badge";
import { PersonelRoleSchema } from "~/types/personel";

export interface SelectFieldOption {
  id: string;
  label: ReactNode;
}

interface SelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  name: TName;
  control: Control<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: readonly SelectFieldOption[];
  showAllOption?: boolean;
  error?: string;
}

export function SelectField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  name,
  control,
  label,
  placeholder = "Wybierz...",
  options,
  showAllOption = false,
  error,
}: SelectFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <BaseField
          label={label}
          htmlFor={field.name}
          error={error ?? fieldState.error?.message}
        >
          <Select name={field.name} value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={field.name} className="bg-gray-50/50">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {showAllOption && <SelectItem value="all">Wszystkie</SelectItem>}
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </BaseField>
      )}
    />
  );
}

interface BaseSelectProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
  TOption extends string,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  label?: string;
  placeholder?: string;
  options: readonly TOption[] | TOption[];
  renderItem: (value: TOption) => React.ReactNode;
  showAllOption?: boolean;
}

function BaseSelect<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
  TOption extends string,
>({
  field,
  fieldState,
  label,
  placeholder = "Wybierz...",
  options,
  renderItem,
  showAllOption = false,
}: BaseSelectProps<TFieldValues, TName, TOption>) {
  return (
    <BaseField
      label={label}
      error={fieldState.error?.message}
      htmlFor={field.name}
    >
      <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && <SelectItem value="all">Wszystkie</SelectItem>}

          {options.map((option) => (
            <SelectItem value={option} key={option}>
              {renderItem(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField>
  );
}

const repairStatusOptions = RepairStatusSchema.options;

export function RepairStatusSelect<T extends FieldValues, N extends Path<T>>(
  props: Omit<BaseSelectProps<T, N, string>, "options" | "renderItem">,
) {
  return (
    <BaseSelect
      {...props}
      label="Status Naprawy"
      options={repairStatusOptions}
      renderItem={(status) => <RepairStatusBadge status={status} />}
      showAllOption
    />
  );
}

const accountStatusOptions = AccountStatusSchema.options;

export function AccountStatusSelect<T extends FieldValues, N extends Path<T>>(
  props: Omit<BaseSelectProps<T, N, string>, "options" | "renderItem">,
) {
  return (
    <BaseSelect
      showAllOption
      {...props}
      label="Status konta"
      options={accountStatusOptions}
      renderItem={(status) => <AccountStatusBadge status={status} />}
    />
  );
}

const personelRoleOptions = PersonelRoleSchema.options;

export function PersonelRoleSelect<T extends FieldValues, N extends Path<T>>(
  props: Omit<BaseSelectProps<T, N, string>, "options" | "renderItem">,
) {
  return (
    <BaseSelect
      {...props}
      label="Rola"
      options={personelRoleOptions}
      placeholder="Wybierz role"
      renderItem={(r) => <span className="capitalize">{r}</span>}
    />
  );
}

const deviceTypeOptions = DeviceTypeSchema.options;

export function DeviceTypeSelect<T extends FieldValues, N extends Path<T>>(
  props: Omit<BaseSelectProps<T, N, string>, "options" | "renderItem">,
) {
  return (
    <BaseSelect
      {...props}
      label="Typ"
      placeholder="Wybierz typ"
      options={deviceTypeOptions}
      renderItem={(type) => (
        <span>{DEVICE_TYPE_LABELS[type as DeviceType]}</span>
      )}
    />
  );
}
