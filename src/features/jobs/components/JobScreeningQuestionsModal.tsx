'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { ScreeningQuestion } from '../types/job-steps.types';
import { getOptionLetter } from '../utils';

type JobScreeningQuestionsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: ScreeningQuestion[];
};

// Read-only "Screening Questions (N)" list (Figma 11661:114959).
export default function JobScreeningQuestionsModal({
  open,
  onOpenChange,
  questions,
}: JobScreeningQuestionsModalProps) {
  const t = useTranslations('companyPage.jobs.attachments');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-card flex max-h-[85vh] w-[calc(100%-2rem)] max-w-253 flex-col gap-6 rounded-3xl border-0 p-6 sm:min-w-0"
      >
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-secondary text-2xl font-bold sm:text-[28px]">
            {t('dialog-title', { count: questions.length })}
          </DialogTitle>
          <DialogClose asChild>
            <Button size="icon-circle" aria-label={t('close')} className="shrink-0">
              <X aria-hidden="true" className="size-5" />
            </Button>
          </DialogClose>
        </div>
        <DialogDescription className="sr-only">{t('title')}</DialogDescription>
        <Accordion type="multiple" className="flex flex-col gap-3 overflow-y-auto">
          {questions.map((question, index) => (
            <AccordionItem
              key={question.id}
              value={question.id}
              className="border-border rounded-2xl border px-4"
            >
              <AccordionTrigger iconType="arrow" className="items-center gap-3 py-6 text-start hover:no-underline">
                <span className="bg-primary-bg text-primary flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                  Q{index + 1}
                </span>
                <span className="text-foreground min-w-0 flex-1 text-sm">
                  {question.question}
                  {question.required ? ` (${t('required')})` : null}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 ps-13">
                <QuestionDetails question={question} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}

function QuestionDetails({ question }: { question: ScreeningQuestion }) {
  const t = useTranslations('companyPage.jobs.attachments');
  const answer =
    question.type === 'text'
      ? question.correctText
      : question.options
          .filter((option) => question.correctOptionIds.includes(option.id))
          .map((option) => option.text)
          .join(', ');

  return (
    <dl className="bg-muted flex flex-col gap-3 rounded-xl p-4 text-sm">
      <div className="flex gap-2">
        <dt className="font-semibold">{t('type-label')}:</dt>
        <dd>{t(`types.${question.type}`)}</dd>
      </div>
      {question.type === 'single' || question.type === 'multi' ? (
        <div className="flex flex-col gap-2">
          <dt className="font-semibold">{t('options-label')}</dt>
          {question.options.map((option, index) => (
            <dd key={option.id} className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">{getOptionLetter(index)}.</span>
              {option.text}
            </dd>
          ))}
        </div>
      ) : null}
      {answer ? (
        <div className="flex gap-2">
          <dt className="font-semibold">{t('correct-answer')}:</dt>
          <dd>{answer}</dd>
        </div>
      ) : null}
    </dl>
  );
}
