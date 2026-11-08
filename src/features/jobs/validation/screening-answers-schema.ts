import { z } from 'zod';
import type { ApplyScreeningQuestion } from '../types/job-apply.types';

type ScreeningAnswersMessages = {
  required: string;
};

const answerSchema = z.object({
  questionId: z.string(),
  selected: z.array(z.string()),
  text: z.string(),
});

// Required questions need a picked option (or text for short answers).
export const createScreeningAnswersSchema = (
  questions: ApplyScreeningQuestion[],
  messages: ScreeningAnswersMessages,
) =>
  z
    .object({ answers: z.array(answerSchema) })
    .superRefine(({ answers }, ctx) => {
      questions.forEach((question, index) => {
        if (!question.required) return;
        const answer = answers[index];
        const isText = question.type === 'text';
        const isEmpty = isText
          ? !answer?.text.trim()
          : !answer?.selected.length;
        if (!isEmpty) return;
        ctx.addIssue({
          code: 'custom',
          path: ['answers', index, isText ? 'text' : 'selected'],
          message: messages.required,
        });
      });
    });

export type TScreeningAnswersSchema = z.infer<
  ReturnType<typeof createScreeningAnswersSchema>
>;
