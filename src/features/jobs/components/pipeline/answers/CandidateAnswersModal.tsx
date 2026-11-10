'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Accordion } from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { CandidateScreeningAnswers } from '../../../types/candidate-answers.types';
import { countAnswerResults } from '../../../utils/candidate-answers';
import AnswerTag from './AnswerTag';
import CandidateAnswerCard from './CandidateAnswerCard';

type CandidateAnswersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answers: CandidateScreeningAnswers;
};

// Candidate's screening answers vs the correct answers (Figma 10086:89120), opened from the CV modal.
export default function CandidateAnswersModal({
  open,
  onOpenChange,
  answers,
}: CandidateAnswersModalProps) {
  const t = useTranslations('companyPage.candidates.answers');
  const counts = countAnswerResults(answers.questions);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="bg-card flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-255 flex-col gap-6 rounded-2xl border-0 p-5 sm:min-w-0 sm:px-10 sm:py-12"
      >
        <div className="flex items-center justify-between gap-4">
          <DialogTitle className="text-foreground text-2xl font-semibold sm:text-[28px]">
            {t('title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button
              size="icon-circle"
              aria-label={t('close')}
              className="bg-assessment-primary hover:bg-assessment-primary/90 size-12 shrink-0"
            >
              <X aria-hidden className="size-5" />
            </Button>
          </DialogClose>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <DialogDescription className="text-muted-foreground min-w-0 flex-1 text-sm">
              {t('summary', {
                job: answers.jobTitle,
                count: answers.questions.length,
              })}
            </DialogDescription>
            <AnswerTag tone="correct">
              {t('count.correct', { count: counts.correct })}
            </AnswerTag>
            <AnswerTag tone="wrong">
              {t('count.wrong', { count: counts.wrong })}
            </AnswerTag>
            <AnswerTag tone="missing">
              {t('count.missing', { count: counts.missing })}
            </AnswerTag>
          </div>

          <Accordion
            type="multiple"
            defaultValue={answers.questions.map((question) => question.id)}
            className="scrollbar-hide -mx-1 flex min-h-0 flex-col gap-4 overflow-y-auto px-1"
          >
            {answers.questions.map((question, index) => (
              <CandidateAnswerCard
                key={question.id}
                question={question}
                number={index + 1}
              />
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
