'use client';

import { FormProvider } from 'react-hook-form';
import { ArrowLeft, ArrowRight, LoaderCircle, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import HttpStatusState from '@/shared/components/HttpStatusState';
import DeleteModal from '@/shared/components/modals/DeleteModal';
import SuccessModal from '@/shared/components/modals/SuccessModal';
import { Button } from '@/shared/components/ui/button';
import { MIN_ASSESSMENT_QUESTIONS } from '../../constants/assessment-builder';
import { useAssessmentBuilder } from '../../hooks/useAssessmentBuilder';
import { useAssessmentLeaveGuard } from '../../hooks/useAssessmentLeaveGuard';
import type { AssessmentBuilderProps } from '../../types/assessment-builder.types';
import AssessmentProgress from './AssessmentProgress';
import AssessmentConfigurationStep from './AssessmentConfigurationStep';
import AssessmentQuestionsStep from './AssessmentQuestionsStep';
import AssessmentReviewStep from './AssessmentReviewStep';
import AssessmentQuestionModal from './AssessmentQuestionModal';
import AssessmentLeaveModal from './AssessmentLeaveModal';

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
    <div className="mx-auto w-full max-w-7xl [--primary-bg:var(--assessment-primary-bg)] [--primary:var(--assessment-primary)]">
      <AssessmentProgress step={builder.step} />
      <header className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-secondary text-2xl font-bold md:text-[28px]">
            {t(builder.step === 2 ? 'review-title' : 'title')}
          </h1>
          {builder.step !== 1 && (
            <p className="text-muted-foreground mt-2 text-sm">
              {t(
                builder.step === 2
                  ? 'review-description'
                  : 'configuration-description',
              )}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {builder.step === 1 && (
            <div className="flex gap-2 text-xs">
              <span className="bg-muted rounded-full px-3 py-2">
                {t('total-score')}{' '}
                <span
                  className={
                    builder.totalScore === 100
                      ? 'text-primary'
                      : 'text-destructive'
                  }
                >
                  {Number(builder.totalScore.toFixed(2))}%
                </span>
              </span>
              <span className="bg-muted rounded-full px-3 py-2">
                {t('questions-count', { count: builder.questions.length })}
              </span>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={t('leave-title')}
            onClick={() => leave.requestLeave()}
          >
            <X className="size-5" />
          </Button>
        </div>
      </header>
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
          <footer
            className={
              builder.step === 0
                ? 'mt-10 flex justify-center'
                : 'mt-10 flex flex-wrap items-center justify-between gap-4'
            }
          >
            {builder.step > 0 && (
              <Button
                type="button"
                variant="outline"
                size="pill"
                className="gap-3 px-6 md:min-w-56"
                disabled={builder.pending}
                onClick={builder.previous}
              >
                <ArrowLeft className="size-4 rtl:rotate-180" />
                {t(builder.step === 1 ? 'back-configuration' : 'previous')}
              </Button>
            )}
            {builder.step === 0 ? (
              <Button type="submit" size="pill" className="min-w-56">
                {t('next')}
              </Button>
            ) : (
              <Button
                type="button"
                size="pill"
                className="disabled:bg-disabled gap-3 px-6 disabled:opacity-100 md:min-w-56"
                disabled={
                  !builder.canReview || builder.pending || builder.success
                }
                onClick={() => {
                  if (builder.step === 2) void builder.submit();
                  else void builder.next();
                }}
              >
                {builder.pending && (
                  <LoaderCircle className="size-4 animate-spin" />
                )}
                {t(builder.step === 1 ? 'review' : 'next')}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            )}
          </footer>
          {builder.step === 1 &&
            builder.questions.length > 0 &&
            !builder.canReview && (
              <p className="text-muted-foreground mt-3 text-end text-sm">
                {t('minimum-questions', { count: MIN_ASSESSMENT_QUESTIONS })}
              </p>
            )}
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
        title={t('success-title')}
        description={t('success-description')}
        primaryAction={{ label: t('go-library'), href: libraryHref }}
        secondaryAction={{
          label: t('create-another'),
          onClick: builder.reset,
          closeOnClick: false,
          variant: 'link',
        }}
      />
    </div>
  );
}
