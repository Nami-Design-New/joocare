import { z } from 'zod';
import { INTERVIEW_METHODS } from '../constants/shared-review-preview-data';

type ScheduleInterviewsMessages = {
  dateRequired: string;
  timeRequired: string;
};

export const createScheduleInterviewsSchema = (
  messages: ScheduleInterviewsMessages,
) =>
  z.object({
    interviews: z.array(
      z.object({
        candidateId: z.string(),
        date: z.string().min(1, messages.dateRequired),
        time: z.string().min(1, messages.timeRequired),
        method: z.enum(INTERVIEW_METHODS),
        note: z.string(),
      }),
    ),
  });

export type TScheduleInterviewsSchema = z.infer<
  ReturnType<typeof createScheduleInterviewsSchema>
>;
