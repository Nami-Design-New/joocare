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
      <section className="layout-shell  py-10 pt-10 pb-10 text-center md:pt-30 md:pb-20">
        <section className="layout-content flex flex-col items-center justify-center gap-8">
          <section className="flex mx-auto max-w-108 flex-col items-center justify-center gap-4 leading-tight">
            <SectionTitle sectionTitle="How it works" />
            <h2>{title}</h2>
          </section>
          <section className="flex flex-col mx-auto min-w-full gap-y-6  md:flex-row">
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
    </section>
  );
}
