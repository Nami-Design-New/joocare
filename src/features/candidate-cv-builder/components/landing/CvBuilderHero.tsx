import Image from 'next/image';
import { useTranslations } from 'next-intl';
import FeatureTagline from '@/shared/components/FeatureTagline';
import { CV_BUILDER_HERO_IMAGE } from '../../constants';
import type {
  CvBuilderState,
  CvBuilderSummary,
} from '../../types/cv-builder.types';
import CvBuilderActions from './CvBuilderActions';
import CvStatusLine from './CvStatusLine';

type CvBuilderHeroProps = {
  state: CvBuilderState;
  summary: CvBuilderSummary;
  onShowCv: () => void;
  onDeleteDraft: () => void;
};

// "Smart CV Builder" card: illustration + intro text + state-specific actions.
export default function CvBuilderHero({
  state,
  summary,
  onShowCv,
  onDeleteDraft,
}: CvBuilderHeroProps) {
  const t = useTranslations('candidatePage.buildCv');

  return (
    <section className="grid items-center gap-6 rounded-2xl bg-card p-4 sm:gap-8 sm:p-6 md:grid-cols-2 xl:gap-12.5">
      <Image
        src={CV_BUILDER_HERO_IMAGE}
        alt={t('hero-alt')}
        width={922}
        height={944}
        priority
        className="mx-auto h-auto w-full max-w-107.5"
      />

      <div className="flex flex-col gap-4">
        <FeatureTagline>{t('badge')}</FeatureTagline>
        <h1 className="text-2xl leading-tight font-bold text-secondary sm:text-3xl xl:text-[38px] xl:leading-12">
          {t('title')}
        </h1>
        <p className="text-start leading-5 text-muted-foreground sm:text-justify">
          {t('description')}
        </p>

        <div className="flex flex-col items-end gap-3">
          {state !== 'intro' && (
            <CvStatusLine state={state} summary={summary} />
          )}
          <CvBuilderActions
            state={state}
            onShowCv={onShowCv}
            onDeleteDraft={onDeleteDraft}
          />
        </div>
      </div>
    </section>
  );
}
