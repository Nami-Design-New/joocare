'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { saveCvBuilderStepOneService } from '../services/cv-builder-service';
import type {
  CvBuilderValues,
  CvStepOnePayload,
} from '../types/cv-builder.types';

function toId(value: string, message: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(message);
  }

  return id;
}

function createPayload(
  personal: CvBuilderValues['personal'],
  photoChanged: boolean,
  invalidLocationMessage: string,
): CvStepOnePayload {
  return {
    name: personal.fullName.trim(),
    ...(photoChanged && personal.photo.trim()
      ? { image: personal.photo.trim() }
      : {}),
    // The backend represents nationality with the selected country ID.
    nationality_id: toId(personal.nationality, invalidLocationMessage),
    ...(personal.yearOfBirth ? { birth_date: personal.yearOfBirth } : {}),
    ...(personal.maritalStatus
      ? { marital_status: personal.maritalStatus.toLowerCase() }
      : {}),
    country_id: toId(personal.country, invalidLocationMessage),
    city_id: toId(personal.city, invalidLocationMessage),
    languages: personal.languages
      .filter(({ language, proficiency }) => language && proficiency)
      .map(({ language, proficiency }) => ({
        language,
        proficiency_level: proficiency.toLowerCase(),
      })),
  };
}

export function useSaveCvBuilderStepOne() {
  const locale = useLocale();
  const t = useTranslations('candidatePage.buildCv');
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      personal,
      photoChanged,
    }: {
      personal: CvBuilderValues['personal'];
      photoChanged: boolean;
    }) => {
      const token = session?.accessToken;

      if (!token) {
        throw new Error(t('save-errors.session-expired'));
      }

      return saveCvBuilderStepOneService({
        locale,
        token,
        payload: createPayload(
          personal,
          photoChanged,
          t('save-errors.invalid-location'),
        ),
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['candidate-cv-builder', locale],
      });
      toast.success(t('save-success'));
    },
    onError: (error) => {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : t('save-errors.step-one'),
      );
    },
  });
}
