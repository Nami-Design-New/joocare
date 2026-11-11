import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ProgressRing from '@/shared/components/ProgressRing';
import { ATS_ASSETS } from '../../constants';

type AtsResultCardProps = {
  fileName: string;
  score: number;
};

// The analyzed CV file and its ATS score ring.
export default function AtsResultCard({ fileName, score }: AtsResultCardProps) {
  const t = useTranslations('candidatePage.cvMatchAts.results');

  return (
    <section className="flex items-center justify-between gap-6 rounded-2xl bg-card p-6 sm:gap-11">
      <div className="flex min-w-0 items-center gap-6">
        <Image
          src={ATS_ASSETS.pdfFile}
          alt=""
          width={50}
          height={50}
          className="shrink-0"
        />
        <h1 className="truncate text-xl font-semibold text-foreground sm:text-[28px] sm:leading-9">
          <bdi>{fileName}</bdi>
        </h1>
      </div>
      <ProgressRing
        value={score}
        label={t('score-label')}
        size={120}
        strokeWidth={3}
        className="max-sm:scale-75"
        trackClassName="stroke-ats-primary/20"
        indicatorClassName="stroke-ats-primary"
        valueClassName="text-ats-primary text-3xl font-bold sm:text-[38px]"
      />
    </section>
  );
}
