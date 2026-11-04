'use client';

import { Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { InputField } from '@/shared/components/InputField';
import { MultiSelectInputField } from '@/shared/components/MultiSelectInputField';
import { SelectInputField } from '@/shared/components/SelectInputField';
import { Button } from '@/shared/components/ui/button';
import {
  SCREENING_OPTION_LIMITS,
  SCREENING_QUESTION_TYPES,
  YES_NO_OPTION_IDS,
} from '../../constants';
import { useScreeningQuestionForm } from '../../hooks/useScreeningQuestionForm';
import type { ScreeningQuestion } from '../../types/job-steps.types';
import { getOptionLetter } from '../../utils';
import QuestionRequirementField from './QuestionRequirementField';
import SegmentedPills from './SegmentedPills';

type ScreeningQuestionFormProps = {
  idPrefix: string;
  question?: ScreeningQuestion | null;
  onSubmit: (question: ScreeningQuestion) => void;
  // Defaults to t('submit'); the edit modal passes t('save-changes').
  submitLabel?: string;
  // Inside a dialog the type menu must render in the dialog, like AssessmentQuestionModal.
  portalContainer?: HTMLElement | null;
};

const FIELD_CLASS = 'bg-card border-border h-13 text-base shadow-none';

// Create / edit a screening question (Figma 10173:42822).
export default function ScreeningQuestionForm({
  idPrefix,
  question,
  onSubmit,
  submitLabel,
  portalContainer,
}: ScreeningQuestionFormProps) {
  const t = useTranslations('companyPage.postJob.questions.builder');
  const {
    form,
    options,
    type,
    correctOptionIds,
    required,
    changeType,
    toggleCorrect,
    setCorrectOptionIds,
    addOption,
    removeOption,
    submit,
  } = useScreeningQuestionForm(question, onSubmit);
  const { errors, isSubmitted } = form.formState;
  const isChoice = type !== 'yes-no';

  const hasFieldErrors = Boolean(errors.question || errors.options);
  const summary = hasFieldErrors
    ? t(
        type === 'single'
          ? 'invalid-single'
          : type === 'multi'
            ? 'invalid-multi'
            : 'invalid-question',
      )
    : errors.correctOptionIds?.message;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-6">
        <SelectInputField
          id={`${idPrefix}-type`}
          aria-label={t('question-type')}
          value={type}
          options={SCREENING_QUESTION_TYPES.map((value) => ({
            value,
            label: t(value),
          }))}
          onChange={changeType}
          portalContainer={portalContainer}
          className={FIELD_CLASS}
        />
        <div className="flex flex-col gap-3">
          <InputField
            id={`${idPrefix}-question`}
            aria-label={t('question-label')}
            placeholder={t('question-placeholder')}
            error={errors.question?.message}
            className={FIELD_CLASS}
            {...form.register('question')}
          />
          {isChoice ? (
            <fieldset className="flex flex-col gap-4">
              <legend className="text-foreground/80 mb-4 text-[13px] font-semibold">
                {t('answer-options')}
              </legend>
              <div className="flex flex-col gap-3">
                {options.fields.map((field, index) => {
                  const letter = getOptionLetter(index);
                  return (
                    <div
                      key={field.fieldKey}
                      className="flex items-start gap-3"
                    >
                      <span className="text-muted-foreground mt-2 w-6 text-lg">
                        {letter}.
                      </span>
                      <InputField
                        id={`${idPrefix}-option-${field.id}`}
                        aria-label={t('option-label', { letter })}
                        placeholder={t('option-placeholder')}
                        error={errors.options?.[index]?.text?.message}
                        className="bg-card border-border h-10 text-sm shadow-none"
                        containerStyles="flex-1"
                        {...form.register(`options.${index}.text`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={t('remove-option', { letter })}
                        disabled={
                          options.fields.length <= SCREENING_OPTION_LIMITS.min
                        }
                        onClick={() => removeOption(index)}
                        className="text-destructive hover:text-destructive mt-1 rounded-full"
                      >
                        <Trash2 aria-hidden="true" className="size-5" />
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <Button
                  type="button"
                  variant="link"
                  disabled={
                    options.fields.length >= SCREENING_OPTION_LIMITS.max
                  }
                  onClick={addOption}
                  className="h-auto gap-2 p-0 font-semibold"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  {t('add-option')}
                </Button>
                <span className="text-foreground/65">{t('options-limit')}</span>
              </div>
            </fieldset>
          ) : null}
        </div>
      </div>

      {type === 'single' ? (
        <div className="border-border border-t pt-6">
          <SelectInputField
            id={`${idPrefix}-correct`}
            label={t('correct-answer')}
            placeholder={t('select-answer')}
            value={correctOptionIds[0] ?? ''}
            options={options.fields.map((field, index) => ({
              value: field.id,
              label: getOptionLetter(index),
            }))}
            onChange={(value) => value && toggleCorrect(value)}
            error={errors.correctOptionIds?.message}
            portalContainer={portalContainer}
            className={FIELD_CLASS}
          />
        </div>
      ) : type === 'multi' ? (
        <div className="border-border border-t pt-6">
          <MultiSelectInputField
            id={`${idPrefix}-correct`}
            label={t('correct-many')}
            placeholder={t('select-answer')}
            searchPlaceholder={t('select-answer')}
            value={correctOptionIds}
            options={options.fields.map((field, index) => ({
              value: field.id,
              label: getOptionLetter(index),
            }))}
            onChange={setCorrectOptionIds}
            error={errors.correctOptionIds?.message}
            portalContainer={portalContainer}
            className={FIELD_CLASS}
          />
        </div>
      ) : (
        <div className="-mt-2 flex flex-col gap-3">
          <p className="text-foreground px-1 font-semibold">
            {t('correct-answer')}
          </p>
          <SegmentedPills
            name={`${idPrefix}-yes-no`}
            label={t('correct-answer')}
            value={correctOptionIds[0]}
            onChange={toggleCorrect}
            options={YES_NO_OPTION_IDS.map((id) => ({
              value: id,
              label: t(id),
            }))}
          />
        </div>
      )}

      <Controller
        control={form.control}
        name="required"
        render={({ field }) => (
          <QuestionRequirementField
            name={`${idPrefix}-required`}
            required={required}
            onChange={field.onChange}
          />
        )}
      />

      {isSubmitted && summary ? (
        <p role="alert" className="text-destructive text-center text-sm">
          {summary}
        </p>
      ) : null}

      <Button type="submit" size="pill" className="h-12.5 w-full font-semibold">
        {submitLabel ?? t('submit')}
      </Button>
    </form>
  );
}
