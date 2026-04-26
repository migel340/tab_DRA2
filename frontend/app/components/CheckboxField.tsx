import { Checkbox } from "./ui/checkbox";
import { Field, FieldLabel } from "./ui/field";

interface CheckboxFieldProps extends React.ComponentProps<typeof Checkbox> {
  label: string;
}

export default function CheckboxField({ label, ...props }: CheckboxFieldProps) {
  return (
    <Field orientation="horizontal">
      <Checkbox {...props} />
      <FieldLabel>{label}</FieldLabel>
    </Field>
  );
}
