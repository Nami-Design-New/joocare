'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { CvBuilderValues } from '../types/cv-builder.types';
import { toCvDocument } from '../utils/cv-to-document';

// Builds the shared CV document from wizard values, with translated labels.
export function useCvDocument(values: CvBuilderValues) {
  const t = useTranslations('candidatePage.buildCv.document');
  const locale = useLocale();

  return toCvDocument(
    values,
    {
      present: t('present'),
      freshGraduate: t('fresh-graduate'),
      professionalProfile: t('professional-profile'),
      professionalStrengths: t('professional-strengths'),
      yearsOfExperience: (value) => t('years-of-experience', { value }),
      specialty: (value) => t('specialty', { value }),
      subspecialty: (value) => t('subspecialty', { value }),
      licensed: t('licensed'),
      availableNow: t('available-now'),
    },
    locale,
  );
}
