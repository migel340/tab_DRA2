import { Search, X } from "lucide-react";
import { Field, FieldContent } from "./ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { Button } from "./ui/button";
import type {
  ControllerRenderProps,
  ControllerFieldState,
  FieldValues,
  Path,
} from "react-hook-form";

interface SearchBarProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  placeholder?: string;
  button?: React.ReactNode;
}

export default function SearchBar<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({ field, fieldState, placeholder }: SearchBarProps<TFieldValues, TName>) {
  return (
    <div className="flex flex-row gap-5">
      <Field data-invalid={fieldState.invalid}>
        <FieldContent>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              {...field}
              name={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
            />
            <InputGroupButton onClick={() => field.onChange("")}>
              {field.value && field.value.length > 0 && <X />}
            </InputGroupButton>
          </InputGroup>
        </FieldContent>
      </Field>
      <Button type="submit">Szukaj</Button>
    </div>
  );
}
