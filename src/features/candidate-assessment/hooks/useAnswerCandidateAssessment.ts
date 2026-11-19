import { useMutation, useQueryClient } from '@tanstack/react-query';
import { answerCandidateAssessment } from '../services/candidate-assessment-service';
import type { AssessmentAnswer } from '../types/assessment-api.types';
import { useAssessmentSession } from './useAssessmentSession';

export function useAnswerCandidateAssessment(id: string) {
  const options = useAssessmentSession();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (answer: AssessmentAnswer) =>
      answerCandidateAssessment(id, answer, options),
    retry: false,
    onError: () => {
      void client.invalidateQueries({ queryKey: ['candidate-assessment'] });
    },
    onSuccess: (result) => {
      void client.invalidateQueries({
        queryKey: ['candidate-assessment'],
        refetchType: result.is_submitted ? 'active' : 'none',
      });
    },
  });
}
