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
          <span className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-2xl">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-secondary text-2xl font-semibold md:text-3xl">
            {title}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {subtitle}
          </p>
        </div>
      </div>
      {action}
    </header>
  );
}
