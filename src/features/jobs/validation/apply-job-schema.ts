import { z } from 'zod';

export function createApplyJobSchema(messages: { invalidAnswers: string }) {
  const id = z
    .number({ error: messages.invalidAnswers })
    .int(messages.invalidAnswers)
    .positive(messages.invalidAnswers);
  return z.object({
    job_id: id,
    cv: z.string().min(1, messages.invalidAnswers).optional(),
    answers: z
      .array(
        z.object({
          question_id: id,
          answer_ids: z
            .array(id)
            .min(1, messages.invalidAnswers)
            .refine(
              (ids) => new Set(ids).size === ids.length,
              messages.invalidAnswers,
            ),
        }),
      )
      .refine(
        (answers) =>
          new Set(answers.map((answer) => answer.question_id)).size ===
          answers.length,
        messages.invalidAnswers,
      ),
  });
}
