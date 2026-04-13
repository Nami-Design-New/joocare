import { z } from "zod";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const qualificationSchema = z
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
      .max(150, "University must be at most 150 characters."),
    countryId: z.string().trim().min(1, "Country is required."),
    startDate: z.string().min(1, "Start date is required."),
    endDate: z.string().optional(),
    image: z
      .array(z.instanceof(File))
      .max(1)
      .default([])
      .refine(
        (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
        "Qualification image must be JPG or PNG.",
      )
      .refine(
        (files) => files.every((file) => file.size <= MAX_IMAGE_SIZE),
        "Qualification image size must not exceed 2MB.",
      ),
  })
  .refine((data) => data.startDate <= new Date().toISOString().split("T")[0], {
    message: "Start date must be today or earlier.",
    path: ["startDate"],
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
  });

export type QualificationSchemaValues = z.input<typeof qualificationSchema>;
export type QualificationSchemaOutput = z.output<typeof qualificationSchema>;
