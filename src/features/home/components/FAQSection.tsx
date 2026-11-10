"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import SectionTitle from "./SectionTitle";
import type { HomeFaq } from "../types/home.types";
import { Button } from "@/shared/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FAQSection({
  title,
  items,
}: {
  title: string;
  items: HomeFaq[];
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const initialCount = 12;

  const visibleItems = isExpanded ? items : items.slice(0, initialCount);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };
  const t = useTranslations();

  return (
    <section className="bg-white pt-10 pb-10 md:pt-16 md:pb-48">
      <div className="layout-shell">
        <div className="layout-content">
          <div className="mb-8 flex flex-col items-center space-y-4">
            <SectionTitle sectionTitle={t('home.faq')} />
            <h2>{title}</h2>
          </div>

          <Accordion type="single" collapsible>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {visibleItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-muted data-[state=open]:bg-card border-border data-[state=open]:ring-border h-fit rounded-2xl border px-6 py-2 transition-all data-[state=open]:shadow-sm data-[state=open]:ring-1"
                >
                  <AccordionTrigger className="group py-4 hover:no-underline">
                    <span className="text-foreground text-left text-sm font-bold md:text-xl">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6 leading-relaxed text-sm md:text-base text-sm md:text-base">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>

          <div className="w-full flex justify-end">
            {items.length > initialCount && (
              <Button
                variant="outline"
                size="pill"
                hoverStyle="slidehorizontalPrimary"
                className="text-muted-foreground text-sm md:text-base group mt-6 items-center gap-2 border-none font-normal flex"
                onClick={handleToggle}
              >
                {isExpanded ? t('search-filter.show-less') : t('search-filter.show-more')}

                < ArrowRight
                  size={28}
                  strokeWidth={1.5}
                  className={`border-muted-foreground text-muted-foreground size-7 rounded-full border bg-white transition-transform 
                ${isExpanded ? "rotate-270" : "rotate-90 group-hover:rotate-90"}`}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}