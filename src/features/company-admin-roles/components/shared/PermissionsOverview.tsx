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
      <h2 className="text-lg leading-[normal] font-semibold text-secondary">
        {t('groups')}
      </h2>
      <p className="text-sm leading-[normal] text-muted-foreground">
        {t('groupCount', { count })}
        {suffix ? <span dir="ltr"> · {suffix}</span> : null}
      </p>
    </div>
  );
}
