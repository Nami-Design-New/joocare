import { MoveRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import SectionTitle from "../../home/components/SectionTitle";
import { FeatureItem } from "./FeatureItem";
import type { WhySectionProps } from "../types";
import { cn } from "@/shared/lib/utils";

export default function WhySection({
  title,
  description,
  items,
}: WhySectionProps) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="mb-2">
              <SectionTitle
                sectionTitle="Talent at the Right Time"
                textColor="text-dark"
              />
            </div>

            <h2 className="mb-6 text-4xl font-bold text-[#0B3765] sm:text-5xl">
              {title}
            </h2>

            <p className="mb-8 text-base leading-relaxed text-[#16304A] lg:text-justify">
              {description}
            </p>

            <Link
              href="/auth/employer/register"
              className={cn(buttonVariants({
                variant: "default"
                , size: "pill"
                , hoverStyle: "slideSecondary"
              }), "mx-auto mt-6 flex w-full items-center justify-center gap-2 sm:mt-8 sm:w-fit")}
            >

              Get Started For Free
              <MoveRight className="mt-0.75" size={16} />

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
