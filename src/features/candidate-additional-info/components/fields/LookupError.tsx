'use client';

import { useTranslations } from 'next-intl';

// Shown under a select whose options failed to load.
export default function LookupError() {
  const t = useTranslations('candidatePage.additional-info.options');
  return <span className="text-xs text-destructive">{t('lookup-error')}</span>;
}
