import z from 'zod';
import { OTHER_JOB_TITLE_VALUE } from '../constants/experience';

type ExperienceSchemaMessages = {
  jobTitleRequired: string;
  organizationMin: string;
  organizationMax: string;
  startDateRequired: string;
  responsibilityMin: string;
  responsibilityMax: string;
  responsibilitiesMin: string;
  otherJobTitleRequired: string;
  startDatePast: string;
  endDateRequired: string;
  endDateAfterStart: string;
};

export const createExperienceModalSchema = (
  messages: ExperienceSchemaMessages,
) =>
  z
    .object({
      jobTitle: z.string().trim().min(1, messages.jobTitleRequired),
      otherJobTitle: z.string().trim().optional(),
      organizationOrHospitalName: z
        .string()
        .trim()
        .min(3, messages.organizationMin)
        .max(100, messages.organizationMax),
      employmentTypeId: z.string().optional(),
      countryId: z.string().optional(),
      cityId: z.string().optional(),
      startDate: z.string().min(1, messages.startDateRequired),
      endDate: z.string().optional(),
      workHere: z.boolean().default(false),
      responsibilities: z
        .array(
          z.object({
            value: z
              .string()
              .trim()
              .min(3, messages.responsibilityMin)
              .max(255, messages.responsibilityMax),
          }),
        )
        .min(1, messages.responsibilitiesMin),
    })
    .refine(
      (data) =>
        data.jobTitle !== OTHER_JOB_TITLE_VALUE ||
        Boolean(data.otherJobTitle?.trim()),
      {
        message: messages.otherJobTitleRequired,
        path: ['otherJobTitle'],
      },
    )
    .refine(
      (data) => data.startDate <= new Date().toISOString().split('T')[0],
      {
        message: messages.startDatePast,
        path: ['startDate'],
      },
    )
    .refine((data) => data.workHere || Boolean(data.endDate), {
      message: messages.endDateRequired,
      path: ['endDate'],
    })
    .refine(
      (data) =>
        data.workHere || !data.endDate || data.endDate >= data.startDate,
      {
        message: messages.endDateAfterStart,
        path: ['endDate'],
      },
    );

export type ExperienceModalFormData = z.infer<
  ReturnType<typeof createExperienceModalSchema>
>;
