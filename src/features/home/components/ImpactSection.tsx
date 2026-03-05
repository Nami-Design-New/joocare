import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import SectionTitle from "./SectionTitle";
import StatCard from "./StatCard";

export const ImpactSection = () => {
  return (
    <section className="bg-background px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <SectionTitle sectionTitle="Proven Hiring Impact" />
            <h2 className="text-foreground mt-4 mb-8 text-3xl leading-tight font-bold lg:text-3xl">
              Measurable Impact Across <br /> Healthcare Hiring
            </h2>
            <p className="text-muted-foreground mb-8 max-w-132 text-xl">
              Joocare delivers measurable hiring outcomes by combining AI-driven
              intelligence with a verified network of healthcare professionals.
            </p>
            <Button
              variant="default"
              size="pill"
              hoverStyle="slideSecondary"
              className="w-fit gap-2"
            >
              <Image
                src="/assets/icons/get-started-button.svg"
                width={20}
                height={20}
                alt=""
              />
              Let&apos;s get started
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              value="500,000"
              label="Verified Healthcare Professionals"
            />
            <StatCard value="100,000" label="Active Job opportunities" />
            <StatCard value="500" label="Healthcare Specializations Covered" />
            <StatCard value="98%" label="Hiring Success Rate" />
          </div>
        </div>
      </div>
    </section>
  );
};
