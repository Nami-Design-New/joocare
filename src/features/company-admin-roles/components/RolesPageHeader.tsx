'use client';

import { useTranslations } from 'next-intl';
import CountPageHeader from '@/shared/components/common/CountPageHeader';

export default function RolesPageHeader({ count }: { count: number }) {
  const t = useTranslations('companyPage.roles');

  return <CountPageHeader count={count} title={t('title')} />;
}
