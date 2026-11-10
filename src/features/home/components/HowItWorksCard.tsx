import Image from "next/image";
import React from "react";

type HowItWorksCardProps = {
  icon: string;
  title: string;
  description: string;
};

export default function HowItWorksCard({
  icon,
  title,
  description,
}: HowItWorksCardProps) {
  return (
    <section className="border-border grow flex flex-col items-center justify-center gap-3 border-b px-2 pt-4 pb-8 ">
      <div className="bg-primary items-center flex size-14 justify-center rounded-full shrink-0">
        <Image src={icon} width={28} height={28} alt={`${title} Icon`} />
      </div>

      <div className="flex flex-col justify-center gap-1">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-muted-foreground text-sm md:text-base text-start">{description}</p>
      </div>

    </section>
  );
}
