import { RepairStatus } from "~/types/status";
import { BaseField } from "./BaseField";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "./ui/select";
import { StatusBadge } from "./StatusBadge";

interface StatusSelectProps extends React.ComponentProps<typeof Select> {}

export default function StatusSelect({ ...props }: StatusSelectProps) {
  return (
    <BaseField label={"Status"}>
      <Select {...props}>
        <SelectTrigger>
          <SelectValue placeholder="Wybierz Status" />
        </SelectTrigger>
        <SelectContent>
          {RepairStatus.map((status) => (
            <SelectItem value={status} key={status}>
              <StatusBadge status={status} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </BaseField>
  );
}
