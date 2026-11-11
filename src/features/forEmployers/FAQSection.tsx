'use client';

import { CircleQuestionMark } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import type { EmployerFaqItem } from './types';

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

            <h2 className="text-2xl leading-tight font-bold text-secondary md:text-5xl">
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
                      className="h-fit rounded-2xl border border-border bg-muted px-6 py-2 transition-all data-[state=open]:bg-card data-[state=open]:shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-border"
                    >
                      <AccordionTrigger className="group py-4 hover:no-underline">
                        <span className="text-left text-sm font-bold text-foreground md:text-xl">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
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
