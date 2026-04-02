import Image from "next/image";
import Cons from "./Cons";
import Pros from "./Pros";
import SectionTitle from "./SectionTitle";

export default function WhyUs() {
  return (
    <section className="bg-white px-0 py-10 md:py-20">
      <div className="container mx-auto mb-8 flex flex-col items-center space-y-4 px-3 lg:px-25">
        <SectionTitle sectionTitle="Why Joocare?" />
        <h2 className="text-center">
          Why Traditional Hiring Models No Longer <br /> Serve Healthcare
        </h2>
      </div>
      <div className="flex flex-col lg:flex-row">
        <div className="bg-container-gray container mx-auto flex flex-col px-3 py-10 md:py-20 lg:flex-row lg:px-25 lg:pl-22">
          <Cons />
        </div>
        <div className="relative hidden w-70 shrink-0 xl:flex">
          <Image
            src="/assets/why-container.svg"
            fill
            alt="Why Joocare"
            className="object-cover"
          />
        </div>
        <div className="bg-container container mx-auto flex flex-col px-3 py-10 pr-4 text-white md:py-20 lg:px-25">
          <Pros />
        </div>
      </div>
    </section>
  );
}
