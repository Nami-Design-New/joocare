"use client";

import SectionTitle from "@/features/home/components/SectionTitle";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { useState } from "react";
import type { AboutPillar } from "../types/about.types";
import CorePillarsAccordionItem from "./CorePillarsAccordionItem";

export default function CorePillarsContent({
  title,
  items,
}: {
  title: string;
  items: AboutPillar[];
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="px-1 sm:px-0">
      <div className="mb-4">
        <SectionTitle sectionTitle="Why choose us?" textColor="text-dark" />
      </div>

      <h2 className="text-secondary mb-6 text-3xl leading-tight font-bold sm:mb-8 sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      <div className="space-y-6">
        {items.map((pillar, index) => (
          <CorePillarsAccordionItem
            key={pillar.id}
            pillar={pillar}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>

      <Link

        href={"/auth/candidate/login"}
        className={cn(buttonVariants({
          variant: "default"
          , size: "pill",
          hoverStyle: "slideSecondary"
        }), "mt-8 w-full justify-center gap-2 sm:w-fit")}
      >
        Get Started For Free
      </Link>
    </div>
  );
}
