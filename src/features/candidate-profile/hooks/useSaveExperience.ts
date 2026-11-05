'use client';

import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import {
  createExperience,
  updateExperience,
} from '../services/experience-client-service';
import { toExperiencePayload } from '../utils/experience-form';
import type { ExperienceModalFormData } from '../validation/experience-modal-schema';

export function useSaveExperience(experienceId?: string) {
  const t = useTranslations('candidatePage.toasts');
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (form: ExperienceModalFormData) => {
      const token = session?.accessToken;

      if (!token) {
        throw new Error(t('session-expired'));
      }

      const payload = toExperiencePayload(form, { locale, token });

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
