import type { ReactNode } from 'react';
import { Check, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type ModalInfoPanelProps = {
  title: string;
  tone?: 'warning' | 'success';
  // A list panel shows check items; a callout shows a short description.
  items?: string[];
  description?: string;
  // Replaces the default round "i" badge (callouts use their own icon).
  icon?: ReactNode;
  className?: string;
};

const TONES = {
  warning: { panel: 'bg-warning/10', badge: 'bg-warning text-white', title: 'text-secondary' },
  success: { panel: 'bg-primary-bg', badge: 'bg-primary text-primary-foreground', title: 'text-primary' },
};

export default function ModalInfoPanel({
  title,
  tone = 'success',
  items,
  description,
  icon,
  className,
}: ModalInfoPanelProps) {
  const styles = TONES[tone];
  const isList = Boolean(items?.length);

  return (
    <section
      className={cn(
        'flex items-start gap-4 rounded-2xl px-6 py-5 text-start',
        styles.panel,
        className,
      )}
    >
      {icon ?? (
        <span
          aria-hidden="true"
          className={cn('flex size-7.5 shrink-0 items-center justify-center rounded-full', styles.badge)}
        >
          <Info className="size-4" />
        </span>
      )}
      <div className={cn('flex min-w-0 flex-col', isList ? 'gap-3 pt-0.5' : 'gap-1 self-center')}>
        <h3
          className={cn(
            'font-semibold',
            isList ? 'text-secondary text-[17px]' : cn('text-lg', styles.title),
          )}
        >
          {title}
        </h3>
        {isList ? (
          <ul className="flex flex-col gap-3">
            {items?.map((item) => (
              <li key={item} className="text-foreground/80 flex items-start gap-3 text-[15px]">
                <span
                  aria-hidden="true"
                  className={cn('flex size-5.5 shrink-0 items-center justify-center rounded-full', styles.badge)}
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-[15px] leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
