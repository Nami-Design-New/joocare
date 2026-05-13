import { z } from "zod";

function isValidGpaFormat(value: string) {
  return /^(?:[0-3](?:\.\d+)?|4(?:\.0+)?)$/.test(value);
}

type EducationSchemaMessages = {
  degreeMin: string;
  degreeMax: string;
  universityMin: string;
  universityMax: string;
  countryRequired: string;
  startDateRequired: string;
  gpaRequired: string;
  gpaInvalid: string;
  startDatePast: string;
  endDateAfterStart: string;
};

export const createEducationModalSchema = (messages: EducationSchemaMessages) => z
  .object({
    degree: z
      .string()
      .trim()
      .min(3, messages.degreeMin)
      .max(100, messages.degreeMax),
    university: z
      .string()
      .trim()
      .min(3, messages.universityMin)
      .max(100, messages.universityMax),
    countryId: z.string().trim().min(1, messages.countryRequired),
    startDate: z.string().min(1, messages.startDateRequired),
    endDate: z.string().optional(),
    gpa: z
      .string()
      .trim()
      .min(1, messages.gpaRequired)
      .refine((value) => isValidGpaFormat(value), {
        message: messages.gpaInvalid,
      }),
  })
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: messages.startDatePast,
    path: ["startDate"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: messages.endDateAfterStart,
    path: ["endDate"],
  });

export const educationModalSchema = createEducationModalSchema({
  degreeMin: "Degree must be at least 3 characters.",
  degreeMax: "Degree must be at most 100 characters.",
  universityMin: "University must be at least 3 characters.",
  universityMax: "University must be at most 100 characters.",
  countryRequired: "Country is required",
  startDateRequired: "Start date is required",
  gpaRequired: "GPA is required.",
  gpaInvalid: "GPA must be a number between 0 and 4.",
  startDatePast: "Start date must be today or earlier.",
  endDateAfterStart: "End date must be after start date.",
});

export type EducationModalFormData = z.infer<typeof educationModalSchema>;
