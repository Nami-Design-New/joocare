import SectionTitle from "@/features/home/components/SectionTitle";
import Image from "next/image";
import type { AboutImage } from "../types/about.types";

export default function AboutMissionSection({
  title,
  description,
  images,
}: {
  title: string;
  description: string;
  images: AboutImage[];
}) {
  const primaryImage = images[0];
  const secondaryImage = images[1];

  return (
    <section className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="grid grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-3 lg:gap-16 lg:px-0 justify-center items-center">
        <div className="order-2 lg:col-span-2">
          <div className="mb-2">
            <SectionTitle sectionTitle="Our Mission" textColor="text-dark" />
          </div>

          <h2 className="text-secondary my-4 text-3xl leading-tight font-bold sm:text-4xl lg:mb-2 lg:text-5xl">
            {title}
          </h2>

          <p className="text-muted-foreground mb-8 text-left text-sm  sm:text-xl lg:text-justify">
            {description}
          </p>
        </div>

        <div className="flex w-full max-w-[340px] justify-end sm:max-w-[520px] lg:max-w-none lg:col-span-1">
          <div className="relative h-[380px] w-[300px]  rounded-[30px] sm:h-[460px] sm:w-[380px] sm:rounded-[40px] bg-red-200">
            <Image
              src={primaryImage?.image ?? "/assets/about/doctor2.jpg"}
              alt={primaryImage?.alt ?? "Mission image"}
              fill
              className="object-cover rounded-[30px]"
            />
            <div className="absolute top-24 -left-1/2 lg:-left-2/3 translate-x-1/2 h-[210px] w-[170px] overflow-hidden  rounded-[22px] border-8 border-white shadow-xl sm:top-40 sm:h-[260px] sm:w-[220px] sm:rounded-[30px] sm:border-16">
              <Image
                src={secondaryImage?.image ?? "/assets/about/doctor1.jpg"}
                alt={secondaryImage?.alt ?? "Mission image"}
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
