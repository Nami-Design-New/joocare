"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "./ui/button";
import { useState } from "react";

type LanguageToggleProps = {
  "aria-label"?: string;
};

export function LanguageToggle(props: LanguageToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("LanguageToggle");
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const handleLocaleChange = (value: string) => {
    const nextLocale = value.toLowerCase() as "en" | "ar";
    const query = searchParams.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    router.replace(href, { locale: nextLocale });
    router.refresh();
  };

  return (
    <Select value={locale.toUpperCase()} onValueChange={handleLocaleChange}
      open={open}
      onOpenChange={setOpen}
    >
      <SelectTrigger

        aria-label={props["aria-label"] ?? "Language toggle"}
        className={`${buttonVariants({ variant: "ghost", hoverStyle: "slidePrimary" })} text-secondary m-0 flex min-h-13 items-center gap-2 rounded-full border-0 bg-transparent shadow-none [&>svg:last-child]:hidden`}
      >
        <Globe color="var(--secondary)" />
        <SelectValue placeholder="EN" />
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="EN">{t("english")}</SelectItem>
          <SelectItem value="AR">{t("arabic")}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
