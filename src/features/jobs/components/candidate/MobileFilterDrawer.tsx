"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { AccordionSection, FilterState } from "../../types/index.types";
import JobFilterSidebar from "./JobsSideBarFilter";

type MobileFilterDrawerProps = {
  actionPath: string;
  search: string;
  country: string;
  filters: FilterState;
  sections: AccordionSection[];
  salaryTypeOptions: AccordionSection["options"];
};

export default function MobileFilterDrawer(props: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-full border-none bg-white lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[320px] overflow-y-auto bg-white p-0 sm:w-95"
      >
        <SheetHeader className="border-border border-b px-4 py-3">
          <SheetTitle className="text-left text-base font-semibold">
            Filters
          </SheetTitle>
        </SheetHeader>

        {/*
          Re-use the exact same sidebar component.
          We override its `hidden lg:flex` via a wrapper that forces it visible.
        */}
        <div className="[&>aside]:flex [&>aside]:rounded-none [&>aside]:shadow-none">
          <JobFilterSidebar {...props} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
