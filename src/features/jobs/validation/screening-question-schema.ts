import { z } from 'zod';
import { SCREENING_OPTION_LIMITS, YES_NO_OPTION_IDS } from '../constants';

type ScreeningQuestionMessages = {
  questionRequired: string;
  markPositive: string;
  optionRequired: string;
  optionDuplicate: string;
  chooseExactlyOne: string;
  chooseAtLeastOne: string;
  answerRequired: string;
};

// Rules from the Figma developer handoff (12795:114262).
export const createScreeningQuestionSchema = (messages: ScreeningQuestionMessages) =>
  z
    .object({
      type: z.enum(['single', 'multi', 'yes-no', 'text']),
      mark: z
        .string()
        .trim()
        .refine((value) => /^\d+$/.test(value) && Number(value) > 0, messages.markPositive),
      question: z.string().trim().min(1, messages.questionRequired),
      options: z.array(z.object({ id: z.string(), text: z.string() })),
      correctOptionIds: z.array(z.string()),
      correctText: z.string(),
      required: z.boolean(),
    })
    .superRefine((values, ctx) => {
      const isChoice = values.type === 'single' || values.type === 'multi';
      if (isChoice) {
        const seen = new Set<string>();
        values.options.forEach((option, index) => {
          const text = option.text.trim().toLocaleLowerCase();
          if (!text) {
            ctx.addIssue({ code: 'custom', message: messages.optionRequired, path: ['options', index, 'text'] });
          } else if (seen.has(text)) {
            ctx.addIssue({ code: 'custom', message: messages.optionDuplicate, path: ['options', index, 'text'] });
          }
          seen.add(text);
        });
        if (
          values.options.length < SCREENING_OPTION_LIMITS.min ||
          values.options.length > SCREENING_OPTION_LIMITS.max
        ) {
          ctx.addIssue({ code: 'custom', message: messages.optionRequired, path: ['options'] });
        }
      }

      const correctCount = values.correctOptionIds.length;
      if (values.type === 'multi' && correctCount < 1) {
        ctx.addIssue({ code: 'custom', message: messages.chooseAtLeastOne, path: ['correctOptionIds'] });
      }
      if (values.type === 'single' && correctCount !== 1) {
        ctx.addIssue({ code: 'custom', message: messages.chooseExactlyOne, path: ['correctOptionIds'] });
      }
      if (
        values.type === 'yes-no' &&
        (correctCount !== 1 || !YES_NO_OPTION_IDS.includes(values.correctOptionIds[0]))
      ) {
        ctx.addIssue({ code: 'custom', message: messages.chooseExactlyOne, path: ['correctOptionIds'] });
      }
      if (values.type === 'text' && !values.correctText.trim()) {
        ctx.addIssue({ code: 'custom', message: messages.answerRequired, path: ['correctText'] });
      }
    });

export type TScreeningQuestionSchema = z.infer<ReturnType<typeof createScreeningQuestionSchema>>;
