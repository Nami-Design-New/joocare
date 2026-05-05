import { z } from "zod";

function isValidGpaFormat(value: string) {
  return /^(?:[0-3](?:\.\d+)?|4(?:\.0+)?)$/.test(value);
}

export const educationModalSchema = z
  .object({
    degree: z
      .string()
      .trim()
      .min(3, "Degree must be at least 3 characters.")
      .max(100, "Degree must be at most 100 characters."),
    university: z
      .string()
      .trim()
      .min(3, "University must be at least 3 characters.")
      .max(100, "University must be at most 100 characters."),
    countryId: z.string().trim().min(1, "Country is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    gpa: z
      .string()
      .trim()
      .min(1, "GPA is required.")
      .refine((value) => isValidGpaFormat(value), {
        message: "GPA must be a number between 0 and 4.",
      }),
  })
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: "Start date must be today or earlier.",
    path: ["startDate"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

export type EducationModalFormData = z.infer<typeof educationModalSchema>;
