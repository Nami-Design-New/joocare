import { cn } from '@/shared/lib/utils';

type SettingsPageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export default function SettingsPageHeader({
  title,
  description,
  className,
}: SettingsPageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-1', className)}>
      <h1 className="text-2xl leading-tight font-semibold text-foreground md:text-[32px]">
        {title}
      </h1>
      {description ? (
        <p className="text-base text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
