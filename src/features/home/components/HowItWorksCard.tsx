import Image from 'next/image';
import React from 'react';

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
    <section className="flex grow flex-col items-center justify-center gap-3 border-b border-border px-2 pt-2 pb-6 sm:pt-4 sm:pb-8">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary sm:size-14">
        <Image src={icon} width={28} height={28} alt={`${title} Icon`} />
      </div>

      <div className="flex flex-col justify-center gap-1">
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-start text-sm text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
    </section>
  );
}
