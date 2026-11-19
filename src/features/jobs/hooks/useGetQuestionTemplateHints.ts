'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { QUESTION_TEMPLATE_HINTS_QUERY_KEY } from '../constants';
import { getQuestionTemplateHints } from '../services/question-templates-service';

export function useGetQuestionTemplateHints(jobId: number | string | null) {
  const locale = useLocale();
  const { data: session } = useSession();
  const token = session?.accessToken ?? '';
  return useQuery({
    queryKey: [
      QUESTION_TEMPLATE_HINTS_QUERY_KEY,
      locale,
      jobId == null ? null : String(jobId),
    ],
    enabled: Boolean(token && jobId),
    queryFn: () => getQuestionTemplateHints(jobId ?? '', { token, locale }),
  });
}
