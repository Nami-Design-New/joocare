'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import SectionTitle from './SectionTitle';
import type { HomeFaq } from '../types/home.types';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
                onClick={handleToggle}
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
    </section>
  );
}
