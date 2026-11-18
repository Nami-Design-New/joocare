'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import useGetProfileDetails from '../hooks/useGetProfileDetails';
import { toAdditionalInfoForm } from '../utils/profile-details-mapper';
import AdditionalInfoError from './AdditionalInfoError';
import AdditionalInfoForm from './AdditionalInfoForm';
import AdditionalInfoSkeleton from './AdditionalInfoSkeleton';

// Profile "Additional Information" tab: loads the saved profile details into the form.
export default function AdditionalInfoPage() {
  const t = useTranslations('candidatePage.additional-info');
  const { data, isPending, isError, refetch } = useGetProfileDetails();
  const initialValues = useMemo(
    () => (data ? toAdditionalInfoForm(data) : null),
    [data],
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl leading-8 font-semibold sm:text-[32px] sm:leading-10">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </header>

      {isError ? (
        <AdditionalInfoError onRetry={() => void refetch()} />
      ) : isPending || !initialValues ? (
        <AdditionalInfoSkeleton />
      ) : (
        <AdditionalInfoForm initialValues={initialValues} />
      )}
    </div>
  );
}
