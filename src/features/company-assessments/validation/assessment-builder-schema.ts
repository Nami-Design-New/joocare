import { z } from 'zod';
import {
  MAX_ATTACHMENT_BYTES,
  MAX_QUESTION_OPTIONS,
} from '../constants/assessment-builder';

type BuilderValidationMessages = {
  required: string;
  percentage: string;
  duration: string;
  options: string;
  answer: string;
  attachment: string;
};

export function createAssessmentConfigurationSchema(
  messages: BuilderValidationMessages,
) {
  return z.object({
    title: z.string().trim().min(1, messages.required),
    description: z.string().trim().min(1, messages.required),
    passScore: z
      .string()
      .refine(
        (value) =>
          value.trim() !== '' &&
          Number.isFinite(Number(value)) &&
          Number(value) > 0 &&
          Number(value) <= 100,
        messages.percentage,
      ),
    durationMinutes: z
      .string()
      .refine(
        (value) =>
          value.trim() !== '' &&
          Number.isInteger(Number(value)) &&
          Number(value) > 0,
        messages.duration,
      ),
  });
}

export function createAssessmentQuestionSchema(
  messages: BuilderValidationMessages,
) {
  return z
    .object({
      type: z.enum(['yes-no', 'single-choice', 'multiple-choice']),
      score: z
        .string()
        .refine(
          (value) =>
            value.trim() !== '' &&
            Number.isFinite(Number(value)) &&
            Number(value) > 0 &&
            Number(value) <= 100,
          messages.percentage,
        ),
      questionText: z.string().trim().min(1, messages.required),
      options: z.array(z.object({ id: z.string(), text: z.string() })),
      correctAnswers: z.array(z.string()),
      attachmentEnabled: z.boolean(),
      attachment: z
        .custom<File>(
          (value) => typeof File !== 'undefined' && value instanceof File,
        )
        .nullable(),
    })
    .superRefine((value, context) => {
      const add = (path: string, message: string) =>
        context.addIssue({ code: 'custom', path: [path], message });
      if (value.type === 'yes-no') {
        if (
          value.correctAnswers.length !== 1 ||
          !['yes', 'no'].includes(value.correctAnswers[0])
        )
          add('correctAnswers', messages.answer);
      } else {
        if (
          value.options.length < 2 ||
          value.options.length > MAX_QUESTION_OPTIONS ||
          value.options.some((option) => !option.text.trim())
        )
          add('options', messages.options);
        const answers = new Set(value.correctAnswers);
        if (
          !answers.size ||
          answers.size !== value.correctAnswers.length ||
          (value.type === 'single-choice' && answers.size !== 1) ||
          value.correctAnswers.some(
            (id) => !value.options.some((option) => option.id === id),
          )
        )
          add('correctAnswers', messages.answer);
      }
      if (
        value.attachmentEnabled &&
        (!value.attachment ||
          !['image/jpeg', 'image/png'].includes(value.attachment.type) ||
          value.attachment.size > MAX_ATTACHMENT_BYTES)
      )
        add('attachment', messages.attachment);
    });
}
