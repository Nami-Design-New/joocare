import HowItWorksCard from "./HowItWorksCard";
import SectionTitle from "./SectionTitle";
import type { HomeStep } from "../types/home.types";

export default function HowItWorks({
  title,
  steps,
}: {
  title: string;
  steps: HomeStep[];
}) {
  return (
    <section className="bg-white">
      <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-3 py-10 pt-10 pb-10 text-center md:pt-30 md:pb-20 lg:px-25">
        <section className="flex max-w-108 flex-col items-center justify-center gap-4 leading-tight">
          <SectionTitle sectionTitle="How it works" />
          <h2>{title}</h2>
        </section>
        <section className="flex flex-col gap-y-6  md:flex-row">
          {steps.map((step) => (
            <HowItWorksCard
              key={step.id}
              icon={step.image}
              title={step.title}
              description={step.description}
            />
          ))}
        </section>
      </section>
    </section>
  );
}
