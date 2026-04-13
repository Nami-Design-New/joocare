import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import type { FaqItem } from "../types";

export default function FaqAccordionSection({
  title,
  items,
}: {
  title: string;
  items: FaqItem[];
}) {
  return (
    <div className="container mx-auto mt-8 grid grid-cols-12 gap-6 px-3 py-20 lg:px-20">
      <div className="col-span-12 md:col-span-2">
        <div className="flex flex-col items-center gap-4">
          <Image src="/assets/faq.svg" alt="FAQ" width={110} height={110} />
          <h1 className="text-[40px] font-bold">{title}</h1>
        </div>
      </div>

      <div className="col-span-12 gap-4 md:col-span-10">
        <Accordion type="single" collapsible>
          <div className="flex flex-col gap-4">
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
  );
}
