import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import type { FaqItem } from '../types';

export default function FaqAccordionSection({
  title,
  items,
}: {
  title: string;
  items: FaqItem[];
}) {
  return (
    <div className="container mx-auto mt-4 grid grid-cols-12 gap-6 px-3 py-8 sm:mt-8 sm:py-20 lg:px-20">
      <div className="col-span-12 md:col-span-2">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/faq.svg"
            alt={title}
            width={110}
            height={110}
            className="size-20 sm:size-[110px]"
          />
          <h1 className="text-3xl font-bold sm:text-[40px]">{title}</h1>
        </div>
      </div>

      <div className="col-span-12 gap-4 md:col-span-10">
        <Accordion type="single" collapsible>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
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
      </div>
    </div>
  );
}
