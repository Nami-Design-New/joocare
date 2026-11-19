import { z } from 'zod';

const progressSchema = z.object({
  answered: z.number().int().nonnegative(),
  total: z.number().int().positive(),
});

export const assessmentDetailsSchema = z.object({
  is_expired: z.boolean(),
  is_taken_before: z.boolean(),
  is_paused: z.boolean().default(false),
  invited_at: z.string().nullish(),
  expires_at: z.string().nullish(),
  started_at: z.string().nullable(),
  status: z.string(),
  status_label: z.string(),
  can_start: z.boolean().default(false),
  progress: progressSchema.optional(),
  submitted_at: z.string().nullish(),
  time_taken_seconds: z.number().nonnegative().nullish(),
  time_taken_formatted: z.string().nullish(),
  score: z.number().nullish(),
  is_passed: z.boolean().nullish(),
  assessment: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    description: z.string().nullable(),
    passing_score: z.number(),
    time_limit: z.number().positive(),
    is_active: z.boolean(),
  }),
});

const questionSchema = z.object({
  id: z.number().int().positive(),
  type: z.enum(['yes_no', 'single_choice', 'multi_choice']),
  question: z.string(),
  has_file: z.boolean(),
  answers: z
    .array(
      z.object({
        id: z.number().int().positive(),
        answer: z.string(),
      }),
    )
    .min(2),
  files: z.array(z.object({ id: z.number(), file: z.url() })).default([]),
});

export const assessmentAttemptSchema = z
  .object({
    is_submitted: z.boolean(),
    next_question: questionSchema.nullish(),
    is_last_question: z.boolean().optional(),
    progress: progressSchema.optional(),
  })
  .refine((value) => value.is_submitted || Boolean(value.next_question));

export const assessmentAnswerSchema = z.object({
  question_id: z.number().int().positive(),
  answer_ids: z.array(z.number().int().positive()).min(1),
});
