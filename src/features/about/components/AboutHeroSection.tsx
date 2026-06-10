"use client";

import Image from "next/image";
import SectionTitle from "@/features/home/components/SectionTitle";
import AboutFeatureItem from "./AboutFeatureItem";
import type { AboutFeature, AboutImage } from "../types/about.types";
import { useAppSelector } from "@/shared/providers/redux/hooks";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const settings = useAppSelector((state) => state.settings.data);
  const t = useTranslations();

  return (
    <section className="pt-6 xl:pt-14 xl:gap-16 px-2 xl:px-0 bg-background">
      <div className="layout-shell ">
        <div className="layout-content">

          <div className="grid grid-cols-1 gap-10  xl:gap-12  xl:grid-cols-5">
            <div className="xl:col-span-3">
              <div className="mb-2">
                <SectionTitle
                  sectionTitle={t("aboutPage.section-title")}
                  textColor="text-dark"
                />
              </div>

              <h2 className="text-secondary max-w-lg mb-3 text-xl md:text-3xl xl:text-4xl leading-tight font-bold xl:mb-2 ">
                {title}
              </h2>

              <p className="mb-8 max-w-4xl text-left text-xl:leading-relaxed whitespace-pre-line text-gray-600 text-sm md:text-base xl:text-justify">
                {description}
              </p>

              <div className="space-y-5 xl:space-y-6">
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

            <div className="xl:col-span-2">
              <div className="relative mx-auto h-[420px] w-full max-w-[340px] sm:h-[520px] sm:max-w-[520px] xl:max-w-none">
                <div className="absolute top-0 right-0 h-[100%] w-[74%] overflow-hidden rounded-[30px] xl:rounded-[40px]">
                  <Image
                    src={primaryImage?.image ?? "/assets/about/doctor2.jpg"}
                    alt={primaryImage?.alt ?? t("aboutPage.about-image-alt")}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="absolute top-[29.5%] left-0 h-[50%] w-1/2 overflow-hidden rounded-[22px] border-8 border-white shadow-xl xl:rounded-[30px] xl:border-[12px]">
                  <Image
                    src={secondaryImage?.image ?? "/assets/about/doctor1.jpg"}
                    alt={secondaryImage?.alt ?? t("aboutPage.about-image-alt")}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="bg-primary absolute top-[65%] left-[38%] flex aspect-square w-[23.5%] min-w-20 flex-col items-center justify-center rounded-full border-4 border-white text-white shadow-lg xl:min-w-28">
                  <span className="text-lg font-bold xl:text-2xl">{settings?.hiring_success_rate}%</span>
                  <span className="text-[10px] xl:text-xs">{t("aboutPage.verified")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* setting impact */}
          <div className="w-full grid grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
            <div className="flex flex-col items-center justify-start p-8 text-center transition-all ">
              <span className="text-foreground flex items-center gap-2 text-xl  font-bold md:text-4xl ">
                <Plus
                  color="var(--primary)"
                  size={20}
                  className="font-extrabold"
                  strokeWidth={6}
                />
                {settings?.verified_healthcare_professionals}
              </span>
              <p className="text-muted-foreground mt-2 text-sm md:text-base md:text-xl:font-medium">
                {t("home.verified-healthcare-professionals")}
              </p>
            </div>
            <div className="flex flex-col items-center justify-start p-8 text-center transition-all ">
              <span className="text-foreground flex items-center gap-2 text-xl  font-bold md:text-4xl ">
                <Plus
                  color="var(--primary)"
                  size={20}
                  className="font-extrabold"
                  strokeWidth={6}
                />
                {settings?.active_job_opportunities}
              </span>
              <p className="text-muted-foreground mt-2 text-sm md:text-base text-xl:font-medium">
                {t("home.active-job-opportunities")}
              </p>
            </div>
            <div className="flex flex-col items-center justify-start p-8 text-center transition-all ">
              <span className="text-foreground flex items-center gap-2 text-xl  font-bold md:text-4xl ">
                <Plus
                  color="var(--primary)"
                  size={20}
                  className="font-extrabold"
                  strokeWidth={6}
                />
                {settings?.healthcare_specializations_covered}
              </span>
              <p className="text-muted-foreground mt-2 text-sm md:text-base text-xl:font-medium">
                {t("home.healthcare-specializations-covered")}
              </p>
            </div>
            <div className="flex flex-col items-center justify-start p-8 text-center transition-all ">
              <span className="text-foreground flex items-center gap-2 text-xl  font-bold md:text-4xl ">
                {settings?.hiring_success_rate} <span className="text-primary">%</span>
              </span>
              <p className="text-muted-foreground mt-2 text-sm md:text-base text-xl:font-medium">
                {t("home.hiring-success-rate")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
