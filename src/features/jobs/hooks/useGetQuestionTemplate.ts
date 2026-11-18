'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { QUESTION_TEMPLATE_QUERY_KEY } from '../constants';
import { getQuestionTemplate } from '../services/question-templates-service';

export function useGetQuestionTemplate(templateId: string | null) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';
  return useQuery({
    queryKey: [QUESTION_TEMPLATE_QUERY_KEY, locale, templateId],
    enabled: Boolean(token && templateId),
    queryFn: () => getQuestionTemplate(templateId ?? '', { token, locale }),
  });
}
