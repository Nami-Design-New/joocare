import { z } from 'zod';
import type { ApplyScreeningQuestion } from '../types/job-apply.types';

type ScreeningAnswersMessages = {
  required: string;
  invalid: string;
};

const answerSchema = z.object({
  questionId: z.string(),
  selected: z.array(z.string()),
});

// Required questions need at least one picked option.
export const createScreeningAnswersSchema = (
  questions: ApplyScreeningQuestion[],
  messages: ScreeningAnswersMessages,
) =>
  z
    .object({ answers: z.array(answerSchema) })
    .superRefine(({ answers }, ctx) => {
      questions.forEach((question, index) => {
        const answer = answers[index];
        const selected = answer?.selected ?? [];
        if (
          answer?.questionId !== question.id ||
          selected.some(
            (id) => !question.options.some((option) => option.id === id),
          ) ||
          new Set(selected).size !== selected.length ||
          (question.type !== 'multi' && selected.length > 1)
        ) {
          ctx.addIssue({
            code: 'custom',
            path: ['answers', index, 'selected'],
            message: messages.invalid,
          });
          return;
        }
        if (!question.required || selected.length > 0) return;
        ctx.addIssue({
          code: 'custom',
          path: ['answers', index, 'selected'],
          message: messages.required,
        });
      });
      if (answers.length !== questions.length) {
        ctx.addIssue({
          code: 'custom',
          path: ['answers'],
          message: messages.invalid,
        });
      }
    });

export type TScreeningAnswersSchema = z.infer<
  ReturnType<typeof createScreeningAnswersSchema>
>;
