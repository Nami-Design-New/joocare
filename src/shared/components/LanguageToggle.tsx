import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  return (
    <Select defaultValue="EN">
      <SelectTrigger className="border-0 shadow-none bg-transparent flex items-center gap-2">
        <Globe />
        <SelectValue placeholder="EN" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="EN">EN</SelectItem>
          <SelectItem value="AR">عربي</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
