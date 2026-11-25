import { format } from 'date-fns';
import { z } from 'zod';
import { INTERVIEW_METHODS } from '../constants/shared-review-preview-data';

type ScheduleInterviewsMessages = {
  dateRequired: string;
  dateInPast: string;
  timeRequired: string;
};

export const createScheduleInterviewsSchema = (
  messages: ScheduleInterviewsMessages,
) =>
  z.object({
    interviews: z.array(
      z.object({
        candidateId: z.string(),
        date: z.iso
          .date(messages.dateRequired)
          .refine(
            (date) => date >= format(new Date(), 'yyyy-MM-dd'),
            messages.dateInPast,
          ),
        time: z.string().min(1, messages.timeRequired),
        method: z.enum(INTERVIEW_METHODS),
        note: z.string(),
      }),
    ),
  });

export type TScheduleInterviewsSchema = z.infer<
  ReturnType<typeof createScheduleInterviewsSchema>
>;
