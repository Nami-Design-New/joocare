import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import SectionTitle from "./SectionTitle";
import type { HomeFaq } from "../types/home.types";

export default function FAQSection({
  title,
  items,
}: {
  title: string;
  items: HomeFaq[];
}) {

  return (
    <section className="bg-white pt-10 pb-10 md:pt-16 md:pb-48">
      <div className="container mx-auto px-3 lg:px-25">
        <div className="mb-8 flex flex-col items-center space-y-4">
          <SectionTitle sectionTitle="FAQ" translationKey="faq" />
          <h2>{title}</h2>
        </div>

        <Accordion type="single" collapsible>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
    </section>
  );
}
