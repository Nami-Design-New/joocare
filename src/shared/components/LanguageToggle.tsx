import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Globe } from "lucide-react";
import { Button } from "./ui/button";

export function LanguageToggle() {
  return (
    <Select defaultValue="EN">
      <Button
        variant="ghost"
        hoverStyle="slidePrimary"
        className="rounded-full min-h-13 "
      >
        <SelectTrigger className="border-0 text-secondary shadow-none bg-transparent flex items-center gap-2">
          <Globe color="var(--secondary)" />
          <SelectValue placeholder="EN" />
        </SelectTrigger>
      </Button>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="EN">EN</SelectItem>
          <SelectItem value="AR">عربي</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
