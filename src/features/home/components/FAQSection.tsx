import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import SectionTitle from "./SectionTitle";

const faqData = [
  {
    id: "item-1",
    question: "How can I subscribe to Joocare services?",
    answer:
      "This placeholder text is used to preview layout, text alignment, and the page's visual structure before adding real content.",
  },
  {
    id: "item-2",
    question: "How can I subscribe to Joocare services?",
    answer:
      "This placeholder text is used to preview layout, text alignment, and the page's visual structure before adding real content.",
  },
  // Add more items as needed to fill the grid
];

export default function FAQSection() {
  // Duplicate data to match the 10-item grid in the image
  const displayData = [...faqData, ...faqData, ...faqData];

  return (
    <section className="bg-white pt-10 pb-10 md:pt-16 md:pb-48">
      <div className="container mx-auto px-3 lg:px-25">
        <div className="mb-8 flex flex-col items-center space-y-4">
          {/* Decorative Badge */}
          <SectionTitle sectionTitle="FAQ" />
          <h2>Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayData.map((item, index) => (
              <AccordionItem
                key={`${item.id}-${index}`}
                value={`${item.id}-${index}`}
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
