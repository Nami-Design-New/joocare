import { useTranslations } from 'next-intl';

type PermissionsOverviewProps = {
  count: number;
  suffix?: string;
};

export default function PermissionsOverview({
  count,
  suffix,
}: PermissionsOverviewProps) {
  const t = useTranslations('companyPage.roles.permissions');

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-secondary text-lg leading-[normal] font-semibold">
        {t('groups')}
      </h2>
      <p className="text-muted-foreground text-sm leading-[normal]">
        {t('groupCount', { count })}
        {suffix ? <span dir="ltr"> · {suffix}</span> : null}
      </p>
    </div>
  );
}
