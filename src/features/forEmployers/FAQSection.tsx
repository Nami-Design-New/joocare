"use client";

import { CircleQuestionMark } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import type { EmployerFaqItem } from "./types";

type FAQSectionProps = {
  title: string;
  items: EmployerFaqItem[];
};

export default function FAQSection({ title, items }: FAQSectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <CircleQuestionMark size={60} />
            </div>

            <h2 className="text-secondary text-4xl leading-tight font-bold sm:text-5xl">
              {title}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4">
              <Accordion type="single" collapsible>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="bg-muted data-[state=open]:bg-card border-border data-[state=open]:ring-border h-fit rounded-2xl border px-6 py-2 transition-all data-[state=open]:shadow-sm data-[state=open]:ring-1"
                    >
                      <AccordionTrigger className="group py-4 hover:no-underline">
                        <span className="text-foreground text-left text-lg font-bold md:text-xl">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
