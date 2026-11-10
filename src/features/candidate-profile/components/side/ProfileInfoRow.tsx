import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

type ProfileInfoRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  /** `inline`: label and value on one line; `stacked`: label above the value. */
  layout?: 'inline' | 'stacked';
};

// Icon tile + label / value row of the profile side panel; the last row drops its divider.
export default function ProfileInfoRow({
  icon,
  label,
  value,
  layout = 'inline',
}: ProfileInfoRowProps) {
  const isStacked = layout === 'stacked';

  return (
    <li className="group flex items-center gap-2.5 py-1">
      <span
        aria-hidden
        className="bg-assessment-primary/8 text-assessment-primary flex size-8.5 shrink-0 items-center justify-center rounded-[10px] [&_svg]:size-5"
      >
        {icon}
      </span>
      <div
        className={cn(
          'border-border flex min-w-0 flex-1 gap-1.5 border-b py-2 group-last:border-b-0',
          isStacked ? 'flex-col' : 'items-center justify-between',
        )}
      >
        <span className="text-foreground/60 shrink-0 text-[13px] leading-4">
          {label}
        </span>
        <span className="text-foreground min-w-0 text-end text-sm font-semibold break-words">
          <bdi>{value}</bdi>
        </span>
      </div>
    </li>
  );
}
