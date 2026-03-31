import PlainBreadcrumb from '@/shared/components/PlainBreadcramb';
import { Accordion, AccordionContent, AccordionTrigger, AccordionItem } from '@/shared/components/ui/accordion';
import Image from 'next/image';

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

export default function FaqPage() {
    const displayData = [...faqData, ...faqData, ...faqData];

    return (
        <>
            <PlainBreadcrumb
                items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
            />
            <section className='container mx-auto px-3 lg:px-2 mt-8 '>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 md:col-span-2">
                        <div className="flex flex-col items-center gap-4 ">
                            <Image src={'/assets/faq.svg'} alt="FAQ" width={200} height={200} />
                            <h3 className="text-xl font-semibold text-secondary">FAQ</h3>
                        </div>
                    </div>
                    <div className="col-span-12 md:col-span-10 gap-4">
                        <Accordion type="single" collapsible>
                            <div className="flex flex-col gap-4">
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

                </div>

            </section>
        </>
    )
}
