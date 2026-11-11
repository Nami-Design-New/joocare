import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { ATS_ASSETS } from '../constants';

// Analysis in progress: the robot and the disabled "CV Analysis" button.
export default function AtsAnalyzing() {
  const t = useTranslations('candidatePage.cvMatchAts');

  return (
    <section
      aria-busy
      className="flex flex-col items-center gap-10 py-8 sm:gap-18 sm:py-10 lg:py-20"
    >
      <Image
        src={ATS_ASSETS.analyzing}
        alt=""
        width={600}
        height={600}
        priority
        className="size-75 motion-safe:animate-pulse"
      />
      <p role="status" className="sr-only">
        {t('analyzing')}
      </p>
      <Button
        type="button"
        size="pill"
        disabled
        className="h-13 w-56 bg-foreground/15 text-base font-semibold text-foreground/45 disabled:opacity-100"
      >
        {t('analyze')}
      </Button>
    </section>
  );
}
