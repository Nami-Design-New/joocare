import Image from "next/image";
import type { HireSectionProps } from "../types";
import { employerHireFallbackStepImages } from "../utils";

export default function HireSection({
  title,
  description,
  items,
}: HireSectionProps) {
  const steps = items.slice(0, 3);

  return (
    <section id="how-it-works" className="bg-[#EEF8F0] py-12 sm:py-20">
      <div className="layout-container">
        <div className="mb-8 lg:w-[50%]">
          <h2 className="text-secondary text-4xl leading-tight font-bold sm:text-5xl">
            {title}
          </h2>

          <p className="text-secondary mt-2 text-sm opacity-90 sm:text-base">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.id}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
            >
              <div className="flex h-56 items-center justify-center">
                <Image
                  src={
                    step.image ||
                    employerHireFallbackStepImages[index] ||
                    employerHireFallbackStepImages[0]
                  }
                  alt={step.title}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>

              <div className="mt-6 flex-1">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F6FFF6] px-3 py-1 text-sm text-[#0B6B0F]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0F7F10]" />
                  Step {index + 1}
                </span>

                <h3 className="mt-4 text-lg">{step.title}</h3>

                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
