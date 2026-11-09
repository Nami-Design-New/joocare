'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import useGetCountries from '@/shared/hooks/useGetCountries';
import EducationFormModal, {
  EMPTY_EDUCATION_FORM,
  type EducationFormValues,
} from '@/shared/components/modals/EducationFormModal';
import { useRouter } from '@/i18n/navigation';
import {
  createEducation,
  updateEducation,
} from '../../services/education-client-service';
import type { CandidateEducationViewModel } from '../../types/profile.types';
import { createEducationModalSchema } from '../../validation/education-modal-schema';

interface EducationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  education?: CandidateEducationViewModel | null;
}

function toFormValues(
  education?: CandidateEducationViewModel | null,
): EducationFormValues {
  if (!education) return EMPTY_EDUCATION_FORM;

  return {
    degree: education.degree ?? '',
    university: education.university,
    gpa: education.gpa ?? '',
    country: education.countryId ?? '',
    startDate: education.startDate ?? '',
    endDate: education.endDate ?? '',
  };
}

// Profile education modal: shared design, saved to the API (countries from the API lookup).
export function EducationModal({
  open,
  onOpenChange,
  label,
  education,
}: EducationModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { data: session } = useSession();
  const [countrySearch, setCountrySearch] = useState('');
  const schema = useMemo(
    () =>
      createEducationModalSchema({
        degreeMin: t('candidateValidation.degree-min'),
        degreeMax: t('candidateValidation.degree-max'),
        universityMin: t('candidateValidation.university-min'),
        universityMax: t('candidateValidation.university-max'),
        countryRequired: t('authPage.validation.country-required'),
        startDateRequired: t('candidateValidation.start-date-required'),
        gpaRequired: t('candidateValidation.gpa-required'),
        gpaInvalid: t('candidateValidation.gpa-invalid'),
        startDatePast: t('candidateValidation.start-date-past'),
        endDateAfterStart: t('candidateValidation.end-date-after-start'),
      }),
    [t],
  );
  const defaultValues = useMemo(() => toFormValues(education), [education]);
  const {
    countries,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetCountries(countrySearch);
  const countryOptions = useMemo(
    () =>
      countries
        .map((country) => ({
          label: String(country.title ?? country.name ?? ''),
          value: String(country.id),
        }))
        .filter((country) => country.label),
    [countries],
  );

  const handleSubmit = async (form: EducationFormValues) => {
    if (!session?.accessToken) {
      toast.error(t('candidatePage.toasts.session-expired'));
      return;
    }

    try {
      const payload = {
        degree: form.degree.trim(),
        university: form.university.trim(),
        gpa: form.gpa.trim(),
        countryId: form.country,
        startDate: form.startDate,
        endDate: form.endDate.trim() || undefined,
        locale,
        token: session.accessToken,
      };

      const response = education?.id
        ? await updateEducation(education.id, payload)
        : await createEducation(payload);

      toast.success(
        response?.message ??
          (education?.id
            ? t('candidatePage.toasts.education-updated')
            : t('candidatePage.toasts.education-added')),
      );
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('candidatePage.toasts.education-save-failed'),
      );
    }
  };

  return (
    <EducationFormModal
      open={open}
      onOpenChange={(next) => {
        if (!next) setCountrySearch('');
        onOpenChange(next);
      }}
      title={label}
      submitLabel={
        education?.id ? t('common.save') : t('candidatePage.common.add')
      }
      schema={schema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      countryField={{
        options: countryOptions,
        isLoading,
        onSearchChange: setCountrySearch,
        onReachEnd: () => void fetchNextPage(),
        hasNextPage,
        isFetchingNextPage,
      }}
    />
  );
}
