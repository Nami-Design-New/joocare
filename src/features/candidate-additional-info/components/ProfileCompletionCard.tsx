import { Check, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import type { CompletionItem } from '../types/additional-info.types';
import ProgressRing from '@/shared/components/ProgressRing';

type ProfileCompletionCardProps = {
  percent: number;
  items: CompletionItem[];
};

// Completion ring, an encouragement line and a done / pending checklist of the sections.
export default function ProfileCompletionCard({
  percent,
  items,
}: ProfileCompletionCardProps) {
  const t = useTranslations('candidatePage.additional-info');
  const complete = items.every((item) => item.done);

  return (
    <section
      aria-label={t('completion.label')}
      className="bg-card flex flex-col gap-6 rounded-2xl px-6 py-3.5 md:flex-row md:items-center"
    >
      <div className="flex min-w-0 flex-1 items-center gap-6">
        <ProgressRing value={percent} label={t('completion.label')} />
        <div className="flex flex-col gap-1">
          <p className="text-primary text-lg font-semibold">
            {t(complete ? 'completion.done-title' : 'completion.title')}
          </p>
          <p className="text-muted-foreground text-sm">
            {t(
              complete
                ? 'completion.done-description'
                : 'completion.description',
            )}
          </p>
        </div>
      </div>
      <span
        aria-hidden
        className="bg-foreground/10 hidden h-14 w-px md:block"
      />
      <ul className="grid shrink-0 grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2">
        {items.map(({ section, done }) => (
          <li
            key={section}
            className={cn(
              'flex items-center gap-2 text-sm font-medium whitespace-nowrap',
              done ? 'text-foreground/85' : 'text-foreground/50',
            )}
          >
            <span
              className={cn(
                'text-primary-foreground flex size-4.5 shrink-0 items-center justify-center rounded-full',
                done ? 'bg-primary' : 'bg-foreground/20',
              )}
            >
              {done ? (
                <Check aria-hidden strokeWidth={3} className="size-3" />
              ) : (
                <Minus aria-hidden strokeWidth={3} className="size-3" />
              )}
            </span>
            {t(`sections.${section}.title`)}
            <span className="sr-only">
              {t(done ? 'completion.item-done' : 'completion.item-pending')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
