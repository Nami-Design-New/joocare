import { useMutation, useQueryClient } from '@tanstack/react-query';
import { startCandidateAssessment } from '../services/candidate-assessment-service';
import { useAssessmentSession } from './useAssessmentSession';

export function useStartCandidateAssessment(id: string) {
  const options = useAssessmentSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => startCandidateAssessment(id, options),
    retry: false,
    onError: () => {
      void client.invalidateQueries({ queryKey: ['candidate-assessment'] });
    },
  });
}
