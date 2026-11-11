import type { ReactNode } from 'react';

type SharedReviewTitleProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function SharedReviewTitle({
  eyebrow,
  title,
  description,
  action,
}: SharedReviewTitleProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-6">
      <div className="flex min-w-0 flex-col gap-1.5">
        <p className="text-xs font-semibold text-primary uppercase">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold text-foreground md:text-[28px]">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div className="w-full shrink-0 md:w-50">{action}</div> : null}
    </div>
  );
}
