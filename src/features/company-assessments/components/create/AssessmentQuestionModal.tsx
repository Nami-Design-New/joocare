'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { ArrowRight, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { QUESTION_TYPES } from '../../constants/assessment-builder';
import { useAssessmentQuestionForm } from '../../hooks/useAssessmentQuestionForm';
import type {
  BuilderQuestion,
  QuestionFormValues,
} from '../../types/assessment-builder.types';
import QuestionAttachmentField from './QuestionAttachmentField';
import QuestionChoiceFields from './QuestionChoiceFields';
import QuestionPreview from './QuestionPreview';

type AssessmentQuestionModalProps = {
  question: BuilderQuestion | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (values: QuestionFormValues) => void;
};

export default function AssessmentQuestionModal({
  question,
  readOnly = false,
  onClose,
  onSave,
}: AssessmentQuestionModalProps) {
  const t = useTranslations('companyPage.assessments.builder');
  const locale = useLocale();
  const questionForm = useAssessmentQuestionForm(question);
  const { form, type, changeType, attachmentEnabled, attachment } =
    questionForm;
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );
  const { errors } = form.formState;
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        ref={setPortalContainer}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        showCloseButton={false}
        aria-describedby={undefined}
        onEscapeKeyDown={(event) => {
          if (
            portalContainer?.querySelector(
              '[data-slot="combobox-content"][data-open]',
            )
          )
            event.preventDefault();
        }}
        className="w-[calc(100%_-_2rem)] max-w-240 gap-4 rounded-2xl p-5 [--primary-bg:var(--assessment-primary-bg)] [--primary:var(--assessment-primary)] sm:min-w-0 md:p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-2xl font-semibold md:text-[28px]">
            {t(
              readOnly
                ? 'view-question-title'
                : question
                  ? 'edit-question-title'
                  : 'add-question',
            )}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={t('close')}
            >
              <X className="size-6" />
            </Button>
          </DialogClose>
        </div>
        {readOnly && question ? (
          <QuestionPreview question={question} />
        ) : (
          <form
            noValidate
            onSubmit={form.handleSubmit(onSave)}
            className="space-y-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <SelectInputField
                    id="assessment-question-type"
                    aria-label={t('question-type')}
                    options={QUESTION_TYPES.map((value) => ({
                      value,
                      label: t(value),
                    }))}
                    value={field.value}
                    onChange={changeType}
                    portalContainer={portalContainer}
                    className="bg-transparent shadow-none"
                  />
                )}
              />
              <div className="relative">
                <InputField
                  id="assessment-question-score"
                  aria-label={t('question-score')}
                  placeholder={t('score-placeholder')}
                  type="number"
                  min={1}
                  max={100}
                  {...form.register('score')}
                  error={errors.score?.message}
                  className="bg-transparent pe-10 shadow-none"
                />
                <span className="pointer-events-none absolute end-4 top-4 text-sm">
                  %
                </span>
              </div>
            </div>
            <Controller
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <QuestionAttachmentField
                  enabled={attachmentEnabled}
                  file={attachment}
                  error={errors.attachment?.message}
                  onChange={field.onChange}
                  onEnabledChange={(value) => {
                    form.setValue('attachmentEnabled', value, {
                      shouldDirty: true,
                    });
                    if (!value) {
                      field.onChange(null);
                      form.clearErrors('attachment');
                    }
                  }}
                />
              )}
            />
            <InputField
              id="assessment-question-text"
              aria-label={t('question-text')}
              placeholder={t('question-placeholder')}
              {...form.register('questionText')}
              error={errors.questionText?.message}
              className="bg-transparent shadow-none"
            />
            {type === 'yes-no' ? (
              <Controller
                control={form.control}
                name="correctAnswers"
                render={({ field }) => (
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold">
                      {t('correct-answer')}
                    </legend>
                    <div className="grid grid-cols-2 gap-2">
                      {['yes', 'no'].map((answer) => (
                        <Button
                          type="button"
                          key={answer}
                          variant={
                            field.value.includes(answer) ? 'default' : 'ghost'
                          }
                          className={
                            field.value.includes(answer)
                              ? 'h-11 rounded-full'
                              : 'bg-muted text-muted-foreground h-11 rounded-full'
                          }
                          aria-pressed={field.value.includes(answer)}
                          onClick={() => field.onChange([answer])}
                        >
                          {t(answer)}
                        </Button>
                      ))}
                    </div>
                    {errors.correctAnswers && (
                      <p role="alert" className="text-destructive mt-2 text-sm">
                        {errors.correctAnswers.message}
                      </p>
                    )}
                  </fieldset>
                )}
              />
            ) : (
              <QuestionChoiceFields
                questionForm={questionForm}
                portalContainer={portalContainer}
              />
            )}
            <div className="border-border flex justify-end border-t pt-4">
              <Button
                type="submit"
                variant="secondary"
                size="pill"
                className="w-full gap-3 sm:w-56"
              >
                {t(question ? 'save' : 'add')}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
