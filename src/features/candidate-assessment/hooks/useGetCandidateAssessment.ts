import { useQuery } from '@tanstack/react-query';
import { getCandidateAssessment } from '../services/candidate-assessment-service';
import { useAssessmentSession } from './useAssessmentSession';

export function useGetCandidateAssessment(id: string) {
  const options = useAssessmentSession();
  return useQuery({
    queryKey: ['candidate-assessment', options.locale, options.userId, id],
    enabled: options.enabled && Boolean(options.token),
    queryFn: () => getCandidateAssessment(id, options),
    retry: false,
    refetchOnWindowFocus: false,
  });
}
