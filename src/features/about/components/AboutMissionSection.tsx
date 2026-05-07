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
    <section className="bg-white py-16 sm:py-20 xl:py-24">
      <div className="grid grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 xl:grid-cols-5 xl:gap-16 xl:px-0 justify-center items-center">
        <div className="order-2 xl:col-span-3">
          <div className="mb-2">
            <SectionTitle sectionTitle="Our Mission" textColor="text-dark" />
          </div>

          <h2 className="text-secondary my-7 text-3xl leading-tight font-bold sm:text-4xl xl:mb-2 xl:text-5xl">
            {title}
          </h2>

          <p className="text-muted-foreground my-7 text-left text-sm  sm:text-xl xl:text-justify">
            {description}
          </p>
        </div>

        <div className="xl:col-span-2">
          <div className="relative mx-auto h-[420px] w-full max-w-[340px] sm:h-[520px] sm:max-w-[520px] xl:max-w-none">
            <div className="absolute top-0 right-0 h-[100%] w-[80%] overflow-hidden rounded-[30px] sm:rounded-[40px]">
              <Image
                src={primaryImage?.image ?? "/assets/about/doctor2.jpg"}
                alt={primaryImage?.alt ?? "Mission image"}
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute top-[29.5%] left-0 h-[50%] w-1/2 overflow-hidden rounded-[22px] border-8 border-white shadow-xl sm:rounded-[30px] sm:border-[12px]">
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
