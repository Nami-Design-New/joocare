import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';
import { CV_BUILDER_ICONS } from '../../constants';
import type {
  CvBuilderState,
  CvBuilderSummary,
} from '../../types/cv-builder.types';

type CvStatusLineProps = {
  state: Exclude<CvBuilderState, 'intro'>;
  summary: CvBuilderSummary;
};

// "Your CV is ready …" / "Your CV is a draft …" line above the actions.
export default function CvStatusLine({ state, summary }: CvStatusLineProps) {
  const t = useTranslations('candidatePage.buildCv.status');
  const isDraft = state === 'draft';
  // Isolate the raw date so "18 Sep 2026" keeps its order inside Arabic text.
  const date = `⁨${summary.lastSavedAt}⁩`;

  return (
    <p
      className={cn(
        'flex items-center gap-1.5 text-sm leading-4.5',
        isDraft ? 'text-cv-builder-draft' : 'text-muted-foreground',
      )}
    >
      <Image
        src={isDraft ? CV_BUILDER_ICONS.clock : CV_BUILDER_ICONS.checkCircle}
        alt=""
        width={isDraft ? 14 : 18}
        height={isDraft ? 14 : 18}
        className="shrink-0"
      />
      {isDraft
        ? t('draft', {
            completed: summary.completedSteps,
            total: summary.totalSteps,
            date,
          })
        : t('ready', { date })}
    </p>
  );
}
