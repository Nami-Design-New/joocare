'use client';

import { FormProvider } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAssessmentBuilder } from '../../hooks/useAssessmentBuilder';
import { useAssessmentLeaveGuard } from '../../hooks/useAssessmentLeaveGuard';
import type { AssessmentBuilderProps } from '../../types/assessment-builder.types';
import { getCategoryHref } from '../../utils/assessment-source';
import AssessmentsErrorState from '../shared/AssessmentsErrorState';
import AssessmentBuilderActions from './AssessmentBuilderActions';
import AssessmentBuilderHeader from './AssessmentBuilderHeader';
import AssessmentConfigurationStep from './AssessmentConfigurationStep';
import AssessmentLeaveModal from './AssessmentLeaveModal';
import AssessmentProgress from './AssessmentProgress';
import AssessmentQuestionModal from './AssessmentQuestionModal';
import AssessmentQuestionPreviewModal from './AssessmentQuestionPreviewModal';
import AssessmentQuestionsStep from './AssessmentQuestionsStep';
import AssessmentReviewStep from './AssessmentReviewStep';

export default function AssessmentBuilder(props: AssessmentBuilderProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const router = useRouter();
  const builder = useAssessmentBuilder(props);
  const isEditing = Boolean(props.initialAssessment);
  const libraryHref = getCategoryHref(props.categoryId, 'company');
  const leave = useAssessmentLeaveGuard(builder.isDirty, libraryHref);
  const { assessment, questions } = builder;

  function renderReview() {
    if (assessment.data) {
      return (
        <AssessmentReviewStep
          assessment={assessment.data}
          onPreview={builder.setPreviewQuestionId}
        />
      );
    }
    if (assessment.isError) {
      return (
        <AssessmentsErrorState onRetry={() => void assessment.refetch()} />
      );
    }
    return <Skeleton aria-busy="true" className="h-96 rounded-2xl" />;
  }

  return (
    <div className="mx-auto w-full [--primary-bg:var(--assessment-primary-bg)] [--primary:var(--assessment-primary)]">
      <AssessmentProgress step={builder.step} />
      <AssessmentBuilderHeader
        step={builder.step}
        totalScore={builder.totalScore}
        questionCount={builder.questionCount}
        isEditing={isEditing}
      />
      <FormProvider {...builder.form}>
        <form
          noValidate
          onSubmit={builder.form.handleSubmit(() => {
            void builder.next();
          })}
        >
          {builder.step === 0 && <AssessmentConfigurationStep />}
          {builder.step === 1 && (
            <AssessmentQuestionsStep
              questions={questions.data?.items ?? []}
              total={builder.questionCount}
              page={builder.questionsPage}
              isLoading={questions.isPending}
              isError={questions.isError}
              onRetry={() => void questions.refetch()}
              onPageChange={builder.setQuestionsPage}
              onAdd={() => builder.setQuestionModal({ question: null })}
              onEdit={(question) => builder.setQuestionModal({ question })}
              onDelete={builder.setDeletingQuestion}
            />
          )}
          {builder.step === 2 && renderReview()}
          <AssessmentBuilderActions
            step={builder.step}
            canReview={builder.canReview}
            pending={builder.isSavingConfiguration}
            success={builder.success}
            questionCount={builder.questionCount}
            isEditing={isEditing}
            onPrevious={builder.previous}
            onNext={() => void builder.next()}
            onSubmit={builder.submit}
          />
        </form>
      </FormProvider>
      {builder.questionModal && (
        <AssessmentQuestionModal
          key={builder.questionModal.question?.id ?? 'new-question'}
          question={builder.questionModal.question}
          onClose={() => builder.setQuestionModal(null)}
          onSave={builder.saveQuestion}
        />
      )}
      {builder.previewQuestionId && (
        <AssessmentQuestionPreviewModal
          key={builder.previewQuestionId}
          questionId={builder.previewQuestionId}
          onClose={() => builder.setPreviewQuestionId(null)}
        />
      )}
      <DeleteModal
        className="w-[calc(100%_-_2rem)] max-w-175 rounded-3xl [--primary:var(--assessment-primary)] sm:min-w-0"
        open={Boolean(builder.deletingQuestion)}
        onOpenChange={(open) => {
          if (!open && !builder.isDeletingQuestion)
            builder.setDeletingQuestion(null);
        }}
        title={t('delete-title')}
        description={t('delete-description')}
        confirmLabel={t('confirm-delete')}
        cancelLabel={t('cancel')}
        isLoading={builder.isDeletingQuestion}
        onConfirm={() => void builder.confirmDelete()}
      />
      <AssessmentLeaveModal
        open={leave.leaveOpen}
        onOpenChange={leave.setLeaveOpen}
        onConfirm={leave.confirmLeave}
      />
      <SuccessModal
        className="w-[calc(100%_-_2rem)] max-w-175 rounded-3xl [--primary:var(--assessment-primary)] sm:min-w-0"
        actionsClassName="sm:flex-col [&>a]:h-13 [&>button]:flex-none"
        open={builder.success}
        onOpenChange={(open) => {
          if (!open) router.push(libraryHref);
        }}
        title={t(isEditing ? 'update-success-title' : 'success-title')}
        description={t(
          isEditing ? 'update-success-description' : 'success-description',
        )}
        primaryAction={{ label: t('go-library'), href: libraryHref }}
        secondaryAction={
          isEditing
            ? undefined
            : {
                label: t('create-another'),
                onClick: builder.reset,
                closeOnClick: false,
                variant: 'link',
              }
        }
      />
    </div>
  );
}
