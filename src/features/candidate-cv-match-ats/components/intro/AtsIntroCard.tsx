import Image from 'next/image';
import { useTranslations } from 'next-intl';
import FeatureTagline from '@/shared/components/FeatureTagline';
import { Button } from '@/shared/components/ui/button';
import { ATS_ASSETS } from '../../constants';
import AtsFeatureAccordion from './AtsFeatureAccordion';

type AtsIntroCardProps = {
  onAnalyze: () => void;
};

// Intro card: CV illustration, headline, what the analysis checks and the "CV Analysis" button.
export default function AtsIntroCard({ onAnalyze }: AtsIntroCardProps) {
  const t = useTranslations('candidatePage.cvMatchAts');

  return (
    <section className="grid items-center gap-6 rounded-2xl bg-card p-4 sm:gap-8 sm:p-6 md:grid-cols-2 xl:gap-12.5">
      <Image
        src={ATS_ASSETS.intro}
        alt={t('image-alt')}
        width={924}
        height={1238}
        priority
        className="mx-auto h-auto w-full max-w-107.5"
      />

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 px-4">
          <FeatureTagline>{t('tagline')}</FeatureTagline>
          <h1 className="text-2xl leading-tight font-bold text-secondary sm:text-3xl xl:text-[38px] xl:leading-12">
            {t('title')}
          </h1>
        </div>
        <AtsFeatureAccordion />
        <Button
          type="button"
          size="pill"
          onClick={onAnalyze}
          className="h-12.5 w-fit bg-ats-primary px-8 text-sm font-semibold hover:bg-ats-primary/90"
        >
          {t('analyze')}
        </Button>
      </div>
    </section>
  );
}
