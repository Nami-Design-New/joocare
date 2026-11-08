import { z } from 'zod';
import type { ApplyScreeningQuestion } from '../types/job-apply.types';

type ScreeningAnswersMessages = {
  required: string;
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
        if (!question.required) return;
        if (answers[index]?.selected.length) return;
        ctx.addIssue({
          code: 'custom',
          path: ['answers', index, 'selected'],
          message: messages.required,
        });
      });
    });

export type TScreeningAnswersSchema = z.infer<
  ReturnType<typeof createScreeningAnswersSchema>
>;
