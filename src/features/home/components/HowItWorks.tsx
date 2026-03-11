import HowItWorksCard from "./HowItWorksCard";
import SectionTitle from "./SectionTitle";

const steps = [
  {
    icon: "/assets/icons/precision-profiling.svg",
    title: "Precision Profiling",
    description:
      "We build a structured, AI-powered clinical profile that goes beyond the CV, capturing specialization, certifications, and experience depth.",
  },
  {
    icon: "/assets/icons/intelligent-match.svg",
    title: "Intelligent Matching",
    description:
      "Our AI matches candidates to roles using multiple clinical and professional data points, ensuring accurate role and institutional fit.",
  },
  {
    icon: "/assets/icons/verified-placement.svg",
    title: "Verified Placement",
    description:
      "Only qualified and pre-assessed candidates are introduced, enabling faster decisions and more reliable hiring outcomes.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <section className="container mx-auto flex flex-col items-center justify-center gap-8 px-3 py-10 pt-10 pb-10 text-center md:pt-30 md:pb-20 lg:px-2">
        <section className="flex max-w-108 flex-col items-center justify-center gap-4 leading-tight">
          <SectionTitle sectionTitle="How it works" />
          <h2>A Structured, AI-Driven Hiring Process in 3 Clear Steps</h2>
        </section>
        <section className="flex flex-col gap-6 md:flex-row">
          {steps.map((step) => (
            <HowItWorksCard key={step.title} {...step} />
          ))}
        </section>
      </section>
    </section>
  );
}
