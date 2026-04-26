import { Field } from "./ui/field";
import { Progress } from "./ui/progress";

interface ProgressFieldProps {
  value: number;
}

export function ProgressField({ value }: ProgressFieldProps) {
  return (
    <Field>
      <div className="flex items-center gap-3 h-9">
        <span className="text-sm font-medium">{value}%</span>
        <Progress value={value} className="h-2" />
      </div>
    </Field>
  );
}
