import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  PROFILE_INSIGHTS_ROUTES,
  PROFILE_VIEWER_DEFAULT_LOGO,
} from '../constants';
import type { ProfileViewer } from '../types/profile-insights.types';
import { formatViewedDate } from '../utils/profile-viewers';

type ProfileViewerCardProps = {
  viewer: ProfileViewer;
};

// Company logo, name, type and visit date, with a link to the company profile.
export default function ProfileViewerCard({ viewer }: ProfileViewerCardProps) {
  const t = useTranslations('candidatePage.profileInsights');
  const locale = useLocale();

  return (
    <li className="bg-card border-foreground/5 flex flex-wrap items-center gap-4 rounded-2xl border p-2 sm:flex-nowrap">
      <span className="bg-body-bg flex size-14 shrink-0 items-center sm:size-20 justify-center rounded-2xl">
        <Image
          src={viewer.logo || PROFILE_VIEWER_DEFAULT_LOGO}
          alt={t('logo-alt', { company: viewer.companyName })}
          width={70}
          height={70}
          className="size-12 rounded-xl object-contain sm:size-17.5"
        />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h2 className="text-foreground truncate text-lg leading-6 font-semibold">
          <bdi>{viewer.companyName}</bdi>
        </h2>
        <p className="text-muted-foreground text-base">
          <bdi>{viewer.companyType}</bdi>
        </p>
        <p className="text-foreground/45 text-sm">
          {t('viewed-on', { date: formatViewedDate(viewer.viewedAt, locale) })}
        </p>
      </div>
      <Button
        asChild
        variant="outline"
        className="border-secondary text-secondary h-9.5 shrink-0 rounded-full px-5 text-sm font-normal max-sm:w-full"
      >
        <Link href={PROFILE_INSIGHTS_ROUTES.companyProfile(viewer.companyId)}>
          {t('view-profile')}
        </Link>
      </Button>
    </li>
  );
}
