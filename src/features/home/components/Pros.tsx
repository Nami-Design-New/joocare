import SectionTitle from "./SectionTitle";
import { LiquidGlass } from "@liquidglass/react";
import type { HomeWhyModel } from "../types/home.types";

export default function Pros({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: HomeWhyModel[];
}) {
  return (
    <>
      <SectionTitle
        sectionTitle="The Joocare Model"
        translationKey="joocareModel"
        textColor="text-white"
        icon="/assets/icons/section-title-white-icon.svg"
      />
      <h3 className="mt-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-4 text-body-bg mt-6 mb-10">{description}</p>
      <ul className="flex flex-col items-start gap-8">
        {items.map((item, index) => (
          <li key={item.id} className="flex gap-7">
            <div className={index < items.length - 1 ? "relative" : undefined}>
              <div
                className={`bg-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  index < items.length - 1
                    ? "after:absolute after:top-12 after:left-1/2 after:z-40 after:h-[calc(100%-16px)] after:w-0.5 after:bg-white after:content-['']"
                    : ""
                }`}
              >
                <LiquidGlass
                  borderRadius={9999}
                  blur={0.7}
                  contrast={1}
                  brightness={1.2}
                  saturation={1.2}
                  shadowIntensity={0.3}
                  zIndex={1}
                >
                  {index + 1}
                </LiquidGlass>
              </div>
            </div>
            <div>
              <h4 className="mb-2 text-xl font-semibold">{item.title}</h4>
              <p className="text-body-bg font-normal">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
