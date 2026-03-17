import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { PhoneInput } from "./PhoneInput";
import { LocationFields } from "./LocationFields";

type FieldType = "input" | "select" | "textarea" | "phone" | "location";

interface Field {
  type: FieldType;
  label?: string;
  placeholder?: string;
}

export function RenderField({ field }: { field: Field }) {
  switch (field.type) {
    case "input":
      return <Input label={field.label} placeholder={field.placeholder} />;

    case "select":
      return <Select label={field.label} />;

    case "textarea":
      return <Textarea />;

    case "phone":
      return <PhoneInput />;

    case "location":
      return <LocationFields />;

    default:
      return null;
  }
}
