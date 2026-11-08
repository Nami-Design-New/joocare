'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { createCvBuilderSchema } from '../validation/cv-builder-schema';

// CV builder schema with translated messages (shared by the wizard and the add-item modals).
export function useCvBuilderSchema() {
  const t = useTranslations('candidatePage.buildCv.errors');

  return useMemo(
    () =>
      createCvBuilderSchema({
        required: t('required'),
        invalidEmail: t('invalid-email'),
        invalidUrl: t('invalid-url'),
      }),
    [t],
  );
}
