'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { YES_NO_OPTION_IDS } from '../../constants';
import QuestionRequirementField from './QuestionRequirementField';
import SegmentedPills from './SegmentedPills';

type TemplateQuestionPreviewProps = {
  templateId: string;
  question: string;
  onCancel: () => void;
  onAdd: (answer: string, required: boolean) => void;
};

// Preview of a picked template before it is added (Figma 11531:116889).
export default function TemplateQuestionPreview({
  templateId,
  question,
  onCancel,
  onAdd,
}: TemplateQuestionPreviewProps) {
  const t = useTranslations('companyPage.postJob.questions');
  const [answer, setAnswer] = useState<string>('yes');
  const [required, setRequired] = useState(true);

  return (
    <section className="flex flex-col gap-5 rounded-2xl bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-bg text-sm font-semibold text-primary">
          Q
        </span>
        <p className="pt-1 text-base text-foreground">{question}</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-semibold text-foreground">
              {t('question-type')}
            </span>
            <span className="text-xs text-muted-foreground">
              {t('templates-hint')}
            </span>
          </p>
          <div className="flex h-11 items-center rounded-full border border-border px-4 text-sm text-foreground">
            {t('yes-no')}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-foreground">{t('choose-correct')}</p>
          <SegmentedPills
            name={`template-${templateId}-answer`}
            label={t('choose-correct')}
            value={answer}
            onChange={setAnswer}
            options={YES_NO_OPTION_IDS.map((id) => ({
              value: id,
              label: t(id),
            }))}
          />
        </div>
      </div>
      <QuestionRequirementField
        name={`template-${templateId}-required`}
        required={required}
        onChange={setRequired}
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full border-primary px-10 font-semibold sm:w-56"
          onClick={onCancel}
        >
          {t('cancel')}
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="h-11 gap-2 rounded-full px-8 font-semibold sm:w-56"
          onClick={() => onAdd(answer, required)}
        >
          {t('add-question')}
          <ArrowRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </section>
  );
}
