"use client";

import { useState } from "react";
import SectionTitle from "@/features/home/components/SectionTitle";
import { Button } from "@/shared/components/ui/button";
import CorePillarsAccordionItem from "./CorePillarsAccordionItem";
import { corePillars } from "./core-pillars-data";

export default function CorePillarsContent() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="px-1 sm:px-0">
      <div className="mb-4">
        <SectionTitle sectionTitle="Why choose us?" textColor="text-dark" />
      </div>

      <h2 className="text-secondary mb-6 text-3xl leading-tight font-bold sm:mb-8 sm:text-4xl lg:text-5xl">
        Core Pillars of the
        <br />
        <span className="text-primary">Joocare</span> Framework
      </h2>

      <div className="space-y-6">
        {corePillars.map((pillar, index) => (
          <CorePillarsAccordionItem
            key={pillar.title}
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
