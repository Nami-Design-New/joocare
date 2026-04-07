import { z } from "zod";

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
