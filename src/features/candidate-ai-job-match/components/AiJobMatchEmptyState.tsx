import Image from 'next/image';
import {
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  MapPin,
  Settings,
  Target,
  type LucideIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import AiJobMatchHeader from './AiJobMatchHeader';

const BENEFITS: readonly { key: string; icon: LucideIcon }[] = [
  { key: 'location', icon: MapPin },
  { key: 'role', icon: BriefcaseBusiness },
  { key: 'industry', icon: Building2 },
  { key: 'accuracy', icon: Target },
];

type AiJobMatchEmptyStateProps = {
  onSetPreferences: () => void;
};

export default function AiJobMatchEmptyState({
  onSetPreferences,
}: AiJobMatchEmptyStateProps) {
  const t = useTranslations('candidatePage.aiJobMatch.empty');

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      <AiJobMatchHeader
        title={t('title')}
        subtitle={t('subtitle')}
        icon={<BriefcaseBusiness aria-hidden className="size-6" />}
        action={
          <Button size="pill" className="h-12" onClick={onSetPreferences}>
            <Settings aria-hidden className="size-5" />
            {t('set-your-preferences')}
          </Button>
        }
      />

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <Image
          src="/assets/ai-job-match/set-preferences.png"
          width={120}
          height={120}
          alt=""
          className="size-28"
        />
        <h3 className="text-secondary text-xl font-semibold">{t('heading')}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {t('description')}
        </p>
        <Button size="pill" className="mt-4 h-12" onClick={onSetPreferences}>
          {t('set-preferences')}
          <ChevronRight aria-hidden className="size-5 rtl:rotate-180" />
        </Button>
      </div>

      <ul className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-0">
        {BENEFITS.map(({ key, icon: Icon }) => (
          <li
            key={key}
            className="border-border flex gap-3 xl:border-e xl:px-4 xl:first:ps-0 xl:last:border-e-0 xl:last:pe-0"
          >
            <span className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-full">
              <Icon aria-hidden className="size-5" />
            </span>
            <div>
              <h4 className="text-secondary font-semibold">
                {t(`benefits.${key}.title`)}
              </h4>
              <p className="text-muted-foreground mt-1 text-sm">
                {t(`benefits.${key}.description`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
