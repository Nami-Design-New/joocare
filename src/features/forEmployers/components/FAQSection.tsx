'use client';

import { useState } from 'react';
import { CircleQuestionMark, ArrowRight } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import type { FAQSectionProps } from '../types';
import { useTranslations } from 'next-intl';

export default function FAQSection({ title, items }: FAQSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations();

  const initialCount = 6;
  const visibleItems = isExpanded ? items : items.slice(0, initialCount);

  return (
    <section className="bg-white py-10 sm:py-20">
      <div className="mx-auto px-0 sm:px-6">
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
                  {visibleItems.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="h-fit rounded-2xl border border-border bg-muted px-4 py-1 transition-all data-[state=open]:bg-card data-[state=open]:shadow-sm data-[state=open]:ring-1 data-[state=open]:ring-border sm:px-6 sm:py-2"
                    >
                      <AccordionTrigger className="group py-3 hover:no-underline sm:py-4">
                        <span className="text-left text-sm font-bold text-foreground md:text-xl">
                          {item.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-sm text-muted-foreground sm:pb-6 md:text-base">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </div>
              </Accordion>

              <div className="flex w-full justify-end">
                {items.length > initialCount && (
                  <Button
                    variant="outline"
                    size="pill"
                    hoverStyle="slidehorizontalPrimary"
                    className="group mt-6 flex items-center gap-2 border-none text-sm font-normal text-muted-foreground md:text-base"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded
                      ? t('search-filter.show-less')
                      : t('search-filter.show-more')}

                    <ArrowRight
                      size={28}
                      strokeWidth={1.5}
                      className={`size-7 rounded-full border border-muted-foreground bg-white text-muted-foreground transition-transform ${isExpanded ? 'rotate-270' : 'rotate-90 group-hover:rotate-90'}`}
                    />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
