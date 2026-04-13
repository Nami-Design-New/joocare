import Image from "next/image";
import SectionTitle from "@/features/home/components/SectionTitle";
import AboutFeatureItem from "./AboutFeatureItem";
import type { AboutFeature, AboutImage } from "../types/about.types";

export default function AboutHeroSection({
  title,
  description,
  items,
  images,
}: {
  title: string;
  description: string;
  items: AboutFeature[];
  images: AboutImage[];
}) {
  const primaryImage = images[0];
  const secondaryImage = images[1];

  return (
    <section className="grid grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
      <div>
        <div className="mb-2">
          <SectionTitle sectionTitle="About JooCare" textColor="text-dark" />
        </div>

        <h2 className="text-secondary mb-3 text-3xl leading-tight font-bold sm:text-3xl lg:mb-2 lg:text-4xl">
          {title}
        </h2>

        <p className="mb-8 max-w-xl text-left text-sm leading-relaxed whitespace-pre-line text-gray-600 sm:text-base lg:text-justify">
          {description}
        </p>

        <div className="space-y-5 sm:space-y-6">
          {items.map((feature) => (
            <AboutFeatureItem
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[340px] justify-center sm:max-w-[520px] lg:max-w-none">
        <div className="relative h-[380px] w-[300px] overflow-hidden rounded-[30px] sm:h-[460px] sm:w-[380px] sm:rounded-[40px]">
          <Image
            src={primaryImage?.image ?? "/assets/about/doctor2.jpg"}
            alt={primaryImage?.alt ?? "About image"}
            fill
            className="object-cover"
          />
        </div>

        <div className="absolute top-28 left-0 h-[210px] w-[170px] overflow-hidden rounded-[22px] border-8 border-white shadow-xl sm:top-40 sm:h-[260px] sm:w-[220px] sm:rounded-[30px] sm:border-16">
          <Image
            src={secondaryImage?.image ?? "/assets/about/doctor1.jpg"}
            alt={secondaryImage?.alt ?? "About image"}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
