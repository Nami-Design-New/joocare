import { useTranslations } from 'next-intl';
import { CV_BUILDER_ROUTES } from '@/features/candidate-cv-builder/constants';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import type { AtsOptimizationPoint } from '../../types/cv-match-ats.types';

type OptimizationPointsProps = {
  points: AtsOptimizationPoint[];
};

// Numbered improvement tips and the "Create CV" link to the CV Builder.
export default function OptimizationPoints({
  points,
}: OptimizationPointsProps) {
  const t = useTranslations('candidatePage.cvMatchAts.results');

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-card p-3">
      <div className="flex flex-col gap-5 rounded-xl bg-muted p-3">
        <h2 className="text-[21px] leading-6.5 font-semibold text-foreground/45">
          {t('optimization-points')}
        </h2>
        <ol className="flex flex-col gap-5 px-1">
          {points.map((point, index) => (
            <li
              key={point.title}
              className="flex gap-0.5 text-base leading-5 font-semibold text-foreground"
            >
              <span className="shrink-0">{index + 1}-</span>
              {/* One isolate for the whole mock sentence: two separate bdi runs around
                  a loose ": " get visually reordered by the bidi algorithm in RTL. */}
              <p>
                <bdi>
                  {point.title}: {point.text}
                </bdi>
              </p>
            </li>
          ))}
        </ol>
      </div>
      <Button
        asChild
        size="pill"
        className="h-13 w-56 self-center bg-secondary text-base font-semibold hover:bg-secondary/90"
      >
        <Link href={CV_BUILDER_ROUTES.root}>{t('create-cv')}</Link>
      </Button>
    </section>
  );
}
