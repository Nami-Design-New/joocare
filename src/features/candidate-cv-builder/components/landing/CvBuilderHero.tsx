import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { CV_BUILDER_HERO_IMAGE, CV_BUILDER_ICONS } from '../../constants';
import type {
  CvBuilderState,
  CvBuilderSummary,
} from '../../types/cv-builder.types';
import CvBuilderActions from './CvBuilderActions';
import CvStatusLine from './CvStatusLine';

type CvBuilderHeroProps = {
  state: CvBuilderState;
  summary: CvBuilderSummary;
  onDeleteDraft: () => void;
};

// "Smart CV Builder" card: illustration + intro text + state-specific actions.
export default function CvBuilderHero({
  state,
  summary,
  onDeleteDraft,
}: CvBuilderHeroProps) {
  const t = useTranslations('candidatePage.buildCv');

  return (
    <section className="bg-card grid items-center gap-8 rounded-2xl p-6 md:grid-cols-2 xl:gap-12.5">
      <Image
        src={CV_BUILDER_HERO_IMAGE}
        alt={t('hero-alt')}
        width={922}
        height={944}
        priority
        className="mx-auto h-auto w-full max-w-107.5"
      />

      <div className="flex flex-col gap-4">
        <span className="bg-soft-overlay border-cv-builder-tag-border text-foreground flex w-fit items-center gap-2.5 rounded-xl border px-4 py-2">
          <Image src={CV_BUILDER_ICONS.sparkle} alt="" width={16} height={16} />
          {t('badge')}
        </span>
        <h1 className="text-secondary text-3xl leading-tight font-bold xl:text-[38px] xl:leading-12">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-justify leading-5">
          {t('description')}
        </p>

        <div className="flex flex-col items-end gap-3">
          {state !== 'intro' && (
            <CvStatusLine state={state} summary={summary} />
          )}
          <CvBuilderActions state={state} onDeleteDraft={onDeleteDraft} />
        </div>
      </div>
    </section>
  );
}
