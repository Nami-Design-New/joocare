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
        className={`${buttonVariants({ variant: "ghost", hoverStyle: "slidePrimary" })} text-secondary m-0 flex min-h-13 items-center gap-2 rounded-full border-0 bg-transparent shadow-none`}
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
