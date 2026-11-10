'use client';

import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import type { ExperienceFormValues } from '@/shared/components/modals/ExperienceFormModal';
import { useRouter } from '@/i18n/navigation';
import {
  createExperience,
  updateExperience,
} from '../services/experience-client-service';
import type { CandidateExperienceViewModel } from '../types/profile.types';
import { toExperiencePayload } from '../utils/experience-form';

export function useSaveExperience(
  experience?: CandidateExperienceViewModel | null,
) {
  const t = useTranslations('candidatePage.toasts');
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();
  const experienceId = experience?.id;

  return useMutation({
    mutationFn: async (form: ExperienceFormValues) => {
      const token = session?.accessToken;

      if (!token) {
        throw new Error(t('session-expired'));
      }

      // Country / city aren't in the modal for now: keep the saved ones.
      const payload = toExperiencePayload(form, {
        locale,
        token,
        countryId: experience?.countryId ?? undefined,
        cityId: experience?.cityId ?? undefined,
      });

      return experienceId
        ? updateExperience(experienceId, payload)
        : createExperience(payload);
    },
    onSuccess: (response) => {
      toast.success(
        response?.message ??
          t(experienceId ? 'experience-updated' : 'experience-added'),
      );
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error(error.message || t('experience-save-failed'));
    },
  });
}
