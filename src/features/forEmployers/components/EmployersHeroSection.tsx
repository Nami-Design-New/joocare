import Image from "next/image";
import SectionTitle from "../../home/components/SectionTitle";
import type { EmployersHeroSectionProps } from "../types";
import { employerHeroFallbackImages } from "../utils";
import { getTranslations } from "next-intl/server";

export default async function EmployersHeroSection({
  title,
  description,
  images,
}: EmployersHeroSectionProps) {
  const t = await getTranslations();
  const heroImages =
    images.length > 0 ? images.slice(0, 3) : employerHeroFallbackImages;

  return (
    <section className="bg-white pt-14 py-18 lg:py-18">
      <div className="mx-auto grid  grid-cols-1 gap-10 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-0">
        <div>
          <div className="mb-2">
            <SectionTitle
              sectionTitle={t("forEmployersPage.hero-section-title")}
              textColor="text-dark"
            />
          </div>

          <h2 className="text-secondary mb-3 text-3xl leading-tight font-bold sm:text-4xl lg:mb-2 lg:text-5xl">
            {title}
          </h2>

          <p className="text-secondary mb-8 max-w-xl text-left text-sm leading-relaxed sm:text-base lg:text-justify">
            {description}
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-[520px] items-end justify-center gap-4 lg:max-w-none">
          {heroImages.map((image) => (
            <div
              key={image.id}
              className="relative h-100 w-[220px] overflow-hidden rounded-3xl sm:w-[260px]"
            >
              <Image
                src={image.image}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
