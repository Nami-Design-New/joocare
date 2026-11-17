'use client';

import { useGetAssessmentQuestion } from '../../hooks/useGetAssessmentQuestion';
import AssessmentQuestionModal from './AssessmentQuestionModal';

type AssessmentQuestionPreviewModalProps = {
  questionId: string;
  onClose: () => void;
};

export default function AssessmentQuestionPreviewModal({
  questionId,
  onClose,
}: AssessmentQuestionPreviewModalProps) {
  const question = useGetAssessmentQuestion(questionId);
  return (
    <AssessmentQuestionModal
      question={question.data ?? null}
      readOnly
      isLoading={question.isPending}
      isError={question.isError}
      onClose={onClose}
    />
  );
}
