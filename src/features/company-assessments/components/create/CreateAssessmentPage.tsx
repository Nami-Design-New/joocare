'use client';

import { FormProvider } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import HttpStatusState from '@/shared/components/HttpStatusState';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { useAssessmentBuilder } from '../../hooks/useAssessmentBuilder';
import { useAssessmentLeaveGuard } from '../../hooks/useAssessmentLeaveGuard';
import type { AssessmentBuilderProps } from '../../types/assessment-builder.types';
import AssessmentProgress from './AssessmentProgress';
import AssessmentConfigurationStep from './AssessmentConfigurationStep';
import AssessmentQuestionsStep from './AssessmentQuestionsStep';
import AssessmentReviewStep from './AssessmentReviewStep';
import AssessmentQuestionModal from './AssessmentQuestionModal';
import AssessmentLeaveModal from './AssessmentLeaveModal';
import AssessmentBuilderHeader from './AssessmentBuilderHeader';
import AssessmentBuilderActions from './AssessmentBuilderActions';

export default function CreateAssessmentPage(props: AssessmentBuilderProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const categoryT = useTranslations('companyPage.assessments');
  const router = useRouter();
  const builder = useAssessmentBuilder(props);
  const libraryHref = `/company/assessments/${props.categoryId}`;
  const leave = useAssessmentLeaveGuard(builder.isDirty, libraryHref);
  const category = builder.category;
  if (!category)
    return (
      <HttpStatusState
        statusCode={404}
        title={categoryT('category-not-found')}
        description={categoryT('category-not-found-description')}
        primaryHref="/company/assessments"
        primaryLabel={categoryT('back-to-categories')}
      />
    );

  return (
    <div className="mx-auto w-full [--primary-bg:var(--assessment-primary-bg)] [--primary:var(--assessment-primary)]">
      <AssessmentProgress step={builder.step} />
      <AssessmentBuilderHeader
        step={builder.step}
        totalScore={builder.totalScore}
        questionCount={builder.questions.length}
        isEditing={props.isEditing}
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
              questions={builder.questions}
              onAdd={() => builder.setQuestionModal({ question: null })}
              onEdit={(question) => builder.setQuestionModal({ question })}
              onDelete={builder.setDeletingQuestion}
            />
          )}
          {builder.step === 2 && (
            <AssessmentReviewStep
              configuration={builder.form.getValues()}
              questions={builder.questions}
              onPreview={(question) =>
                builder.setQuestionModal({ question, readOnly: true })
              }
            />
          )}
          {builder.submitError && (
            <p role="alert" className="text-destructive mt-4 text-sm">
              {builder.submitError}
            </p>
          )}
          <AssessmentBuilderActions
            step={builder.step}
            canReview={builder.canReview}
            pending={builder.pending}
            success={builder.success}
            questionCount={builder.questions.length}
            isEditing={props.isEditing}
            onPrevious={builder.previous}
            onNext={() => void builder.next()}
            onSubmit={() => void builder.submit()}
          />
        </form>
      </FormProvider>
      {builder.questionModal && (
        <AssessmentQuestionModal
          key={builder.questionModal.question?.id ?? 'new-question'}
          question={builder.questionModal.question}
          readOnly={builder.questionModal.readOnly}
          onClose={() => builder.setQuestionModal(null)}
          onSave={builder.saveQuestion}
        />
      )}
      <DeleteModal
        className="w-[calc(100%_-_2rem)] max-w-175 rounded-3xl [--primary:var(--assessment-primary)] sm:min-w-0"
        open={Boolean(builder.deletingQuestion)}
        onOpenChange={(open) => {
          if (!open) builder.setDeletingQuestion(null);
        }}
        title={t('delete-title')}
        description={t('delete-description')}
        confirmLabel={t('confirm-delete')}
        cancelLabel={t('cancel')}
        onConfirm={builder.confirmDelete}
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
        title={t(props.isEditing ? 'update-success-title' : 'success-title')}
        description={t(
          props.isEditing
            ? 'update-success-description'
            : 'success-description',
        )}
        primaryAction={{ label: t('go-library'), href: libraryHref }}
        secondaryAction={
          props.isEditing
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
