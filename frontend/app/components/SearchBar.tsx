import { Search } from "lucide-react";
import { Field, FieldContent } from "./ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";

export default function SearchBar() {
  return (
    <div className="flex flex-row gap-5">
      <Field>
        <FieldContent>
          <InputGroup>
            <InputGroupAddon align="inline-start">
              <Search />
            </InputGroupAddon>
            <InputGroupInput />
          </InputGroup>
        </FieldContent>
      </Field>

      <Button>Szukaj</Button>
    </div>
  );
}
