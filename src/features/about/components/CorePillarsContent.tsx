"use client";

import { useState } from "react";
import SectionTitle from "@/features/home/components/SectionTitle";
import { Button } from "@/shared/components/ui/button";
import CorePillarsAccordionItem from "./CorePillarsAccordionItem";
import type { AboutPillar } from "../types/about.types";

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
        <SectionTitle sectionTitle="Why choose us?" translationKey="whyChooseUs" textColor="text-dark" />
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

      <Button
        variant="default"
        size="pill"
        hoverStyle="slideSecondary"
        className="mt-8 w-full justify-center gap-2 sm:w-fit"
      >
        Get Started For Free
      </Button>
    </div>
  );
}
