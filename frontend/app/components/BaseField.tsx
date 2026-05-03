import { Field, FieldDescription, FieldError, FieldLabel } from "./ui/field";

interface BaseFieldProps {
  label?: string;
  error?: string;
  description?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

export function BaseField({
  label,
  error,
  description,
  children,
  htmlFor,
  className,
}: BaseFieldProps) {
  return (
    <Field className={className}>
      {label && <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>}
      {children}
      {description && <FieldDescription> {description}</FieldDescription>}
      {error && <FieldError> {error}</FieldError>}
    </Field>
  );
}
