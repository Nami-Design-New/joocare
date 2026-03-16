"use client";
import { useState } from "react";
import { CircleQuestionMark } from "lucide-react";
import { AccordionItem } from "./AccordionItem";

type QA = { q: string; a: string };

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items: QA[] = [
    {
      q: "How can I subscribe to Joocare services?",
      a: "You can subscribe by contacting our sales team or using the Get Started flow. We'll guide you through plans and onboarding.",
    },
    {
      q: "What verification do you perform on professionals?",
      a: "All professionals go through primary-source verification, license checks, and credential validation before appearing on the platform.",
    },
    {
      q: "Can I filter candidates by availability and location?",
      a: "Yes — use our advanced filters to match candidates by availability, location, specialty, and experience level in real-time.",
    },
    {
      q: "Is messaging secure within the platform?",
      a: "Our messaging channel is encrypted and designed to let you communicate securely with candidates and finalize details.",
    },
    {
      q: "How does pricing work?",
      a: "We offer subscription and transaction-based plans. Contact sales for a pricing plan tailored to your organization's needs.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left column */}
          <div className="lg:col-span-5">
            <div className="mb-6 flex items-center gap-4">
              <CircleQuestionMark size={60} />
              {/* <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300">
              </div> */}
            </div>

            <h2 className="text-secondary text-4xl leading-tight font-bold sm:text-5xl">
              Frequently Asked
              <br />
              Questions
            </h2>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {items.map((it, i) => (
                <AccordionItem
                  key={it.q}
                  item={it}
                  index={i}
                  openIndex={openIndex}
                  setOpenIndex={setOpenIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
