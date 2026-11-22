'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';

type CompanyUsersHeaderProps = {
  count: number;
  onAdd: () => void;
};

export default function CompanyUsersHeader({
  count,
  onAdd,
}: CompanyUsersHeaderProps) {
  const t = useTranslations('companyPage.usersManagement');

  return (
    <CountPageHeader
      count={count}
      title={t('title')}
      action={{
        label: t('addNewMember'),
        icon: <Plus className="size-4" />,
        onClick: onAdd,
      }}
    />
  );
}
