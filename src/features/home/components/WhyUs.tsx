import Image from "next/image";
import Cons from "./Cons";
import Pros from "./Pros";
import SectionTitle from "./SectionTitle";
import type { HomeWhyModel } from "../types/home.types";

export default function WhyUs({
  title,
  legacyModelTitle,
  legacyModelDescription,
  legacyModels,
  joocareModelTitle,
  joocareModelDescription,
  joocareModels,
}: {
  title: string;
  legacyModelTitle: string;
  legacyModelDescription: string;
  legacyModels: HomeWhyModel[];
  joocareModelTitle: string;
  joocareModelDescription: string;
  joocareModels: HomeWhyModel[];
}) {
  return (
    <section className="bg-white px-0 py-10 md:py-20">
      <div className="layout-container mb-8 flex flex-col items-center space-y-4">
        <SectionTitle sectionTitle="Why Joocare?" />
        <h2 className="text-center">{title}</h2>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="bg-container-gray layout-container flex flex-col py-10 md:py-20 lg:flex-row lg:pl-22">
          <Cons
            title={legacyModelTitle}
            description={legacyModelDescription}
            items={legacyModels}
          />
        </div>
        <div className="relative hidden w-70 shrink-0 xl:flex">
          <Image
            src="/assets/why-container.svg"
            fill
            alt="Why Joocare"
            className="object-cover"
          />
        </div>
        <div className="bg-container layout-container flex flex-col py-10 pr-4 text-white md:py-20">
          <Pros
            title={joocareModelTitle}
            description={joocareModelDescription}
            items={joocareModels}
          />
        </div>
      </div>
    </section>
  );
}
