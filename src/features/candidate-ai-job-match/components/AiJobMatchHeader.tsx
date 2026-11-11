import type { ReactNode } from 'react';

type AiJobMatchHeaderProps = {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  action: ReactNode;
};

export default function AiJobMatchHeader({
  title,
  subtitle,
  icon,
  action,
}: AiJobMatchHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {icon && (
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary sm:size-14">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-xl font-semibold text-secondary sm:text-2xl md:text-3xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        </div>
      </div>
      {action}
    </header>
  );
}
