import { MoveLeft, MoveRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/shared/components/ui/button";
import SectionTitle from "../../home/components/SectionTitle";
import { FeatureItem } from "./FeatureItem";
import type { WhySectionProps } from "../types";
import { cn } from "@/shared/lib/utils";
import { getLocale, getTranslations } from "next-intl/server";

export default async function WhySection({
  title,
  description,
  items,
}: WhySectionProps) {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <section className="bg-white py-20">
      <div className="mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-2">
              <SectionTitle
                sectionTitle={t("forEmployersPage.why-section-title")}
                textColor="text-dark"
              />
            </div>

            <h2 className="my-5 text-3xl font-bold text-[#1C2628] md:text-5xl ">
              {title}
            </h2>

            <p className="mb-8 text-base md:text-xl text-[#1C2628] lg:text-justify">
              {description}
            </p>

            <Link
              href="/auth/employer/register"
              className={cn(buttonVariants({
                variant: "default"
                , size: "pill"
                , hoverStyle: "slideSecondary"
              }), "mt-5 flex w-full items-center justify-center gap-2 sm:mt-5 sm:w-fit")}
            >
              {t("forEmployersPage.get-started-for-free")}
              {locale === "ar" ? <MoveLeft className="mt-0.75" size={16} /> :
                <MoveRight className="mt-0.75" size={16} />
              }


            </Link>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-4">
              {items.map((item) => (
                <FeatureItem
                  key={item.id}
                  title={item.title}
                  desc={item.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
