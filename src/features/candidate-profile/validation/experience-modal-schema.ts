import z from "zod";

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

export const createExperienceModalSchema = (messages: ExperienceSchemaMessages) => z
  .object({
    jobTitle: z.string().trim().min(1, messages.jobTitleRequired),
    otherJobTitle: z.string().trim().optional(),
    organizationOrHospitalName: z
      .string()
      .trim()
      .min(3, messages.organizationMin)
      .max(100, messages.organizationMax),
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
    (data) => data.jobTitle !== "__other__" || Boolean(data.otherJobTitle?.trim()),
    {
      message: messages.otherJobTitleRequired,
      path: ["otherJobTitle"],
    },
  )
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: messages.startDatePast,
    path: ["startDate"],
  })
  .refine((data) => data.workHere || Boolean(data.endDate), {
    message: messages.endDateRequired,
    path: ["endDate"],
  })
  .refine(
    (data) => data.workHere || !data.endDate || data.endDate >= data.startDate,
    {
      message: messages.endDateAfterStart,
      path: ["endDate"],
    },
  );

export const experienceModalSchema = createExperienceModalSchema({
  jobTitleRequired: "Job title is required",
  organizationMin: "Organization Name must be at least 3 characters.",
  organizationMax: "Organization Name must be at most 100 characters.",
  startDateRequired: "Start date is required",
  responsibilityMin: "Responsibility must be at least 3 characters.",
  responsibilityMax: "Responsibility must be at most 255 characters.",
  responsibilitiesMin: "At least one responsibility is required",
  otherJobTitleRequired: "Please enter the other job title.",
  startDatePast: "Start date must be today or earlier.",
  endDateRequired: "End date is required unless you currently work here.",
  endDateAfterStart: "End date must be after start date.",
});

export type FormData = z.infer<typeof experienceModalSchema>;
