import { BaseField } from "./BaseField";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./ui/combobox";

interface ComboboxFieldProps {
  emptyText: string;
  placeholder: string;
  label: string;
  error?: string;
  htmlFor: string;
  comboboxProps: React.ComponentProps<typeof Combobox>;
}

export default function ComboboxField({
  emptyText,
  placeholder,
  label,
  error,
  htmlFor,
  comboboxProps,
}: ComboboxFieldProps) {
  return (
    <BaseField label={label} error={error} htmlFor={htmlFor}>
      <Combobox {...comboboxProps}>
        <ComboboxInput placeholder={placeholder} />
        <ComboboxContent>
          <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem
                key={item}
                value={comboboxProps?.itemToStringValue?.(item) ?? item}
              >
                {comboboxProps?.itemToStringLabel?.(item) ?? item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </BaseField>
  );
}
