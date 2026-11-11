import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Badge } from '@/shared/components/ui/badge';

type RoleSummaryCardProps = {
  name: string;
  description?: string;
};

export default function RoleSummaryCard({
  name,
  description,
}: RoleSummaryCardProps) {
  const t = useTranslations('companyPage.roles.permissions');

  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-xl bg-primary/4 p-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8">
        <Image
          src="/assets/icons/permissions/role-shield.svg"
          width={24}
          height={24}
          alt=""
        />
      </div>
      <div className="min-w-0 flex-1 space-y-1" dir="ltr">
        <p className="text-lg leading-[normal] font-semibold break-words text-secondary">
          {name}
        </p>
        {description ? (
          <p className="text-sm leading-[normal] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      <Badge
        variant="outline"
        className="gap-1.5 rounded-full border-0 bg-white px-3 py-1.5 text-sm leading-[normal] font-semibold text-primary"
      >
        <Image
          src="/assets/icons/permissions/permission-eye.svg"
          width={16}
          height={16}
          alt=""
        />
        {t('viewBadge')}
      </Badge>
    </div>
  );
}
