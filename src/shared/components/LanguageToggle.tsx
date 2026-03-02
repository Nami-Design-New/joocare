import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Globe } from "lucide-react";
import { buttonVariants } from "./ui/button";

export function LanguageToggle() {
  return (
    <Select defaultValue="EN">
      <SelectTrigger
        className={`${buttonVariants({ variant: "ghost", hoverStyle: "slidePrimary" })} border-0 text-secondary shadow-none bg-transparent flex items-center gap-2 rounded-full min-h-13  `}
      >
        <Globe color="var(--secondary)" />
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
