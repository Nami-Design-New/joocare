import { useTranslations } from 'next-intl';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import type { CandidateAnswerQuestion } from '../../../types/candidate-answers.types';
import { getAnswerResult } from '../../../utils/candidate-answers';
import AnswerOptionRow from './AnswerOptionRow';
import AnswerTag from './AnswerTag';

type CandidateAnswerCardProps = {
  question: CandidateAnswerQuestion;
  number: number;
};

// One reviewed question: tags (number, requirement, result), the question and every option.
export default function CandidateAnswerCard({
  question,
  number,
}: CandidateAnswerCardProps) {
  const t = useTranslations('companyPage.candidates.answers');
  const result = getAnswerResult(question);

  return (
    <AccordionItem
      value={question.id}
      className="rounded-xl border border-border px-5 last:border-b"
    >
      <AccordionTrigger
        iconType="arrow"
        className="items-start gap-3 py-5 text-start hover:no-underline"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-3.5">
          <span className="flex flex-wrap items-center gap-2">
            <AnswerTag tone="brand">
              {t('question-number', { number })}
            </AnswerTag>
            <AnswerTag tone="neutral">
              {t(question.required ? 'mandatory' : 'optional')}
            </AnswerTag>
            <AnswerTag tone={result}>{t(`result.${result}`)}</AnswerTag>
          </span>
          <span className="text-base font-semibold text-foreground">
            <bdi>{question.question}</bdi>
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2 pb-5">
        <ul className="flex flex-col gap-2">
          {question.options.map((option) => (
            <AnswerOptionRow
              key={option.id}
              text={option.text}
              isMulti={question.type === 'multi'}
              isSelected={question.selectedOptionIds.includes(option.id)}
              isCorrect={question.correctOptionIds.includes(option.id)}
            />
          ))}
        </ul>
        {result === 'missing' ? (
          <p className="rounded-lg bg-answer-missing/8 px-3 py-2.5 text-[13px] font-medium text-answer-missing">
            {t(
              question.required
                ? 'missing-note-mandatory'
                : 'missing-note-optional',
            )}
          </p>
        ) : null}
      </AccordionContent>
    </AccordionItem>
  );
}
