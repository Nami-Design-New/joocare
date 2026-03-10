import SectionTitle from "./SectionTitle";
import { LiquidGlass } from "@liquidglass/react";

export default function Pros() {
  return (
    <>
      <SectionTitle
        sectionTitle="The Joocare Model"
        textColor="text-white"
        icon="/assets/icons/section-title-white-icon.svg"
      />
      <h3 className="mt-2 text-xl font-semibold text-white">
        A Precision-Based Approach to Healthcare Hiring{" "}
      </h3>
      <p className="text-4 text-body-bg mt-6 mb-10">
        Joocare replaces volume with precision and guesswork with intelligence.
        Our AI-driven platform is purpose-built for healthcare and life sciences
        recruitment. It delivers results through three core pillars:
      </p>
      <ul className="flex flex-col items-start gap-8">
        <li className="flex gap-7">
          <div className="relative">
            <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full after:absolute after:top-12 after:left-1/2 after:z-40 after:h-[calc(100%-16px)] after:w-0.5 after:bg-white after:content-['']">
              <LiquidGlass
                borderRadius={9999}
                blur={0.7}
                contrast={1}
                brightness={1.2}
                saturation={1.2}
                shadowIntensity={0.3}
              >
                1
              </LiquidGlass>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-xl font-semibold">
              Clinical Intelligence
            </h4>
            <p className="text-body-bg font-normal">
              Artificial intelligence trained on healthcare classifications,
              certifications, and specialty logic.
            </p>
          </div>
        </li>
        <li className="flex gap-7">
          <div className="relative">
            {" "}
            <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full after:absolute after:top-12 after:left-1/2 after:z-40 after:h-[calc(100%-16px)] after:w-0.5 after:bg-white after:content-['']">
              <LiquidGlass
                borderRadius={9999}
                blur={0.7}
                contrast={1}
                brightness={1.2}
                saturation={1.2}
                shadowIntensity={0.3}
              >
                2
              </LiquidGlass>
            </div>
          </div>
          <div>
            <h4 className="mb-2 text-xl font-semibold">Predictive Matching </h4>
            <p className="text-body-bg font-normal">
              Advanced classification models analyse over 50 data points to
              predict long-term suitability for the role and the organisation.
            </p>
          </div>
        </li>
        <li className="flex gap-7">
          <div className="bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <LiquidGlass
              borderRadius={9999}
              blur={0.7}
              contrast={1}
              brightness={1.2}
              saturation={1.2}
              shadowIntensity={0.3}
            >
              3
            </LiquidGlass>
          </div>
          <div>
            <h4 className="mb-2 text-xl font-semibold">
              Automated Verification{" "}
            </h4>
            <p className="text-body-bg font-normal">
              Pre-screened and compatible profiles reduce screening time by up
              to 70% and enhance hiring confidence.
            </p>
          </div>
        </li>
      </ul>
    </>
  );
}
