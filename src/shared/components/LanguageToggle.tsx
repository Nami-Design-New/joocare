import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "./ui/button";

type LanguageToggleProps = {
  "aria-label"?: string;
};

export function LanguageToggle(props: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const searchParams = useSearchParams();

  const handleLocaleChange = (value: string) => {
    const nextLocale = value.toLowerCase() as "en" | "ar";
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router.replace(href, { locale: nextLocale });
    router.refresh();
  };

  return (
    <Select value={locale.toUpperCase()} onValueChange={handleLocaleChange}>
      <SelectTrigger
        aria-label={props["aria-label"] ?? "Language toggle"}
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
